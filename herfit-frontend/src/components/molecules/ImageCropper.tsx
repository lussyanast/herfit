"use client";

import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";
import getCroppedImg from "./utils/cropImage";
import { Button } from "@/components/atomics/button";

export default function ImageCropper({ image, onCropDone, onCancel }: any) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const cropImage = async () => {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        onCropDone(croppedImage);
    };

    return (
        <div className="relative w-full h-[400px] bg-black">
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-50">
                <Button variant="outline" onClick={onCancel}>Batal</Button>
                <Button onClick={cropImage}>Simpan</Button>
            </div>
        </div>
    );
}
