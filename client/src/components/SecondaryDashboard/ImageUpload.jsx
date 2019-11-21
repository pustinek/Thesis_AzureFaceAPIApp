import { Button } from "@material-ui/core";
import React, { useState } from 'react';
import { useDispatch } from 'reactn';

const ImageUpload = () => {

    const [uploading, setUploading] = useState(false);
    const uploadUserImages = useDispatch('uploadUserImages');
    const [formData, setFormData] = useState(null);
    const onUpload = () => {
        uploadUserImages(formData);
    }

    const onChange = e => {
        const fd = new FormData();
        const files = Array.from(e.target.files);
        setUploading(true);

        files.forEach((file, i) => {
            fd.append("userImages", file)
      });
      setFormData(fd);

    }

    return (
        <div>
            <label htmlFor="multi"></label>
            <Button 
             color="primary"
             size="medium"
             type="submit"
             variant="contained"
            onClick={onUpload}>upload
            </Button>
            <input type="file" id="multi" onChange={onChange} multiple/>
        </div>
    );
};

export default ImageUpload;