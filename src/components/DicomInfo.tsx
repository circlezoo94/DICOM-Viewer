import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Info } from 'lucide-react';
import { DicomImage } from '../utils/dicomParser';

interface DicomInfoProps {
  dicomImage: DicomImage | null;
}

export function DicomInfo({ dicomImage }: DicomInfoProps) {
  if (!dicomImage) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            DICOM Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No DICOM file loaded</p>
        </CardContent>
      </Card>
    );
  }

  const { dataset, width, height, windowCenter, windowWidth, rescaleSlope, rescaleIntercept } = dicomImage;

  const getTagValue = (tag: string): string => {
    const tagData = dataset[tag];
    if (!tagData) return 'N/A';
    
    if (typeof tagData.value === 'string') {
      return tagData.value;
    } else if (typeof tagData.value === 'number') {
      return tagData.value.toString();
    } else {
      return 'N/A';
    }
  };

  const infoItems = [
    { label: 'Patient Name', value: getTagValue('00100010') },
    { label: 'Patient ID', value: getTagValue('00100020') },
    { label: 'Study Instance UID', value: getTagValue('0020000d') },
    { label: 'Image Dimensions', value: `${width} × ${height}` },
    { label: 'Bits Allocated', value: dicomImage.bitsAllocated.toString() },
    { label: 'Bits Stored', value: dicomImage.bitsStored.toString() },
    { label: 'Samples per Pixel', value: dicomImage.samplesPerPixel.toString() },
    { label: 'Photometric Interpretation', value: dicomImage.photometricInterpretation },
    { label: 'Rescale Slope', value: rescaleSlope.toString() },
    { label: 'Rescale Intercept', value: rescaleIntercept.toString() },
    { label: 'Default Window Center', value: windowCenter.toString() },
    { label: 'Default Window Width', value: windowWidth.toString() }
  ];

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          DICOM Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {infoItems.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm break-all">
                    {item.value}
                  </span>
                </div>
                {index < infoItems.length - 1 && <Separator className="mt-2" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}