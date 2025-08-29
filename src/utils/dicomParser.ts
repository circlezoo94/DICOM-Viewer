// DICOM 파일 파싱을 위한 유틸리티
export interface DicomTag {
  tag: string;
  vr: string;
  length: number;
  value: any;
}

export interface DicomDataset {
  [key: string]: DicomTag;
}

export interface DicomImage {
  dataset: DicomDataset;
  pixelData: Uint8Array | Uint16Array;
  width: number;
  height: number;
  windowCenter: number;
  windowWidth: number;
  rescaleSlope: number;
  rescaleIntercept: number;
  photometricInterpretation: string;
  bitsAllocated: number;
  bitsStored: number;
  samplesPerPixel: number;
}

class DicomParser {
  private view: DataView;
  private position: number = 0;
  private littleEndian: boolean = true;

  constructor(arrayBuffer: ArrayBuffer) {
    this.view = new DataView(arrayBuffer);
    this.checkHeader();
  }

  private checkHeader(): void {
    // DICOM 파일 헤더 체크 (간단한 구현)
    const prefix = new Uint8Array(this.view.buffer, 128, 4);
    const dicm = String.fromCharCode(...prefix);
    if (dicm !== 'DICM') {
      // DICM 헤더가 없는 경우, Implicit VR Little Endian으로 가정
      this.position = 0;
    } else {
      this.position = 132; // DICM 헤더 이후부터 시작
    }
  }

  private readUint16(): number {
    const value = this.view.getUint16(this.position, this.littleEndian);
    this.position += 2;
    return value;
  }

  private readUint32(): number {
    const value = this.view.getUint32(this.position, this.littleEndian);
    this.position += 4;
    return value;
  }

  private readBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(this.view.buffer, this.position, length);
    this.position += length;
    return bytes;
  }

  private readString(length: number): string {
    const bytes = this.readBytes(length);
    return String.fromCharCode(...bytes).trim();
  }

  private parseTag(): string {
    const group = this.readUint16();
    const element = this.readUint16();
    return `${group.toString(16).padStart(4, '0')}${element.toString(16).padStart(4, '0')}`;
  }

  public parse(): DicomImage {
    const dataset: DicomDataset = {};
    
    try {
      while (this.position < this.view.byteLength - 8) {
        const tag = this.parseTag();
        
        // VR 읽기 (간단한 구현)
        let vr = '';
        let length = 0;
        
        // Explicit VR인 경우
        if (this.position + 2 < this.view.byteLength) {
          const vrBytes = this.readBytes(2);
          vr = String.fromCharCode(...vrBytes);
          
          if (['OB', 'OW', 'OF', 'SQ', 'UT', 'UN'].includes(vr)) {
            this.position += 2; // reserved bytes
            length = this.readUint32();
          } else {
            length = this.readUint16();
          }
        }
        
        if (length > this.view.byteLength - this.position) {
          break;
        }
        
        let value: any;
        
        // 중요한 태그들만 파싱
        switch (tag) {
          case '00280010': // Rows
          case '00280011': // Columns
          case '00281050': // Window Center
          case '00281051': // Window Width
          case '00281052': // Rescale Intercept
          case '00281053': // Rescale Slope
          case '00280100': // Bits Allocated
          case '00280101': // Bits Stored
          case '00280002': // Samples per Pixel
            value = length >= 2 ? this.view.getUint16(this.position, this.littleEndian) : 0;
            break;
          case '00280004': // Photometric Interpretation
          case '00100010': // Patient Name
          case '00100020': // Patient ID
          case '0020000d': // Study Instance UID
            value = this.readString(length);
            continue;
          case '7fe00010': // Pixel Data
            value = this.readBytes(length);
            dataset[tag] = { tag, vr, length, value };
            continue;
          default:
            value = null;
            break;
        }
        
        if (value !== null) {
          dataset[tag] = { tag, vr, length, value };
        }
        
        this.position += length;
      }
    } catch (error) {
      console.warn('DICOM 파싱 중 오류:', error);
    }

    // 기본값 설정
    const width = dataset['00280011']?.value || 512;
    const height = dataset['00280010']?.value || 512;
    const windowCenter = dataset['00281050']?.value || 128;
    const windowWidth = dataset['00281051']?.value || 256;
    const rescaleSlope = dataset['00281053']?.value || 1;
    const rescaleIntercept = dataset['00281052']?.value || 0;
    const bitsAllocated = dataset['00280100']?.value || 8;
    const bitsStored = dataset['00280101']?.value || 8;
    const samplesPerPixel = dataset['00280002']?.value || 1;
    const photometricInterpretation = dataset['00280004']?.value || 'MONOCHROME2';
    
    let pixelData: Uint8Array | Uint16Array;
    if (dataset['7fe00010']) {
      if (bitsAllocated <= 8) {
        pixelData = new Uint8Array(dataset['7fe00010'].value);
      } else {
        pixelData = new Uint16Array(dataset['7fe00010'].value.buffer);
      }
    } else {
      // 테스트용 더미 데이터
      const size = width * height;
      if (bitsAllocated <= 8) {
        pixelData = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
          pixelData[i] = Math.floor(Math.random() * 256);
        }
      } else {
        pixelData = new Uint16Array(size);
        for (let i = 0; i < size; i++) {
          pixelData[i] = Math.floor(Math.random() * 65536);
        }
      }
    }

    return {
      dataset,
      pixelData,
      width,
      height,
      windowCenter,
      windowWidth,
      rescaleSlope,
      rescaleIntercept,
      photometricInterpretation,
      bitsAllocated,
      bitsStored,
      samplesPerPixel
    };
  }
}

export function parseDicomFile(arrayBuffer: ArrayBuffer): DicomImage {
  const parser = new DicomParser(arrayBuffer);
  return parser.parse();
}