import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import './styles/clipping.css';
import { FaWindowClose } from "react-icons/fa";
import Alert from 'react-s-alert';
import Axios from "axios";
import Deferred from '../components/Deferred';

export default function Clipping() {
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: "%" });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [cropImages, setCropImages] = useState([]);
    const [disabled, setDisabled] = useState(true);

    document.title = 'Training Image'

    const axiosConfig = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "authorization",
            "Content-Type": "application/json;charset=UTF-8",
        }
    };

    // Increase pixel density for crop preview quality on retina screens.
    const pixelRatio = window.devicePixelRatio || 1;

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
        const ctx = previewCanvasRef.current.getContext("2d");

        previewCanvasRef.current.width = completedCrop.width * pixelRatio;
        previewCanvasRef.current.height = completedCrop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            imgRef.current,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );
    }, [completedCrop]);

    // We resize the canvas down when saving on retina devices otherwise the image
    // will be double or triple the preview size.
    function getResizedCanvas(canvas, newWidth, newHeight) {
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = newWidth;
        tmpCanvas.height = newHeight;

        const ctx = tmpCanvas.getContext("2d");
        ctx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            newWidth,
            newHeight
        );

        return tmpCanvas;
    }

    //Imagem em base 64 
    function addImageClipping(previewCanvas, crop, cropImages, texto) {
        if (!crop || !previewCanvas) {
            return;
        }
        const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);
        cropImages.push({ 
            'label': texto, 
            'image': canvas.toDataURL('image/png', 1.0), 'x': crop.x, 'y': crop.y, 'height': crop.height, 'width': crop.width,
            'texto': <Deferred promise={extractOcr(canvas.toDataURL('image/png', 1.0))} then={text => text} />
        })

        return cropImages;
    }

    function deleteItem(index) {
        let items = [...cropImages];
        items.splice(index, 1);
        setCropImages(items);
    }

    function labelInputMessage() {
        return (
            <div className="mb-3 ">
                <label>Digite o nome do recorte</label>
                <input className="form-control col-12 " type="text" id='message_val' placeholder="Digite aqui o nome do recorte..." rows="2" alt="1" maxLength="2000" onKeyPress={
                    () => {
                        let texto = document.getElementById('message_val').value;
                        if ((!completedCrop?.width || !completedCrop?.height) && texto.trim() !== '') {
                            setDisabled(true)
                        } else {
                            setDisabled(false)
                        }
                    }
                }></input>

            </div>
        )
    }

    async function extractOcr(base64) {
        let textOcr = '';
        await Axios.post('/api/ocr/', { 'data': base64.replace("data:image/png;base64,", "") }, axiosConfig).then(response => {
            textOcr = response.data;
        }).catch(error => {
            Alert.error((error && error.message) || 'Algo deu errado. Por favor, tente novamente!');
        });

        return textOcr;
    }

    function previewSelections() {
        return cropImages.map((cropedImage, index) => {
            return (
                <tr className="listElement container-fluid imagesCropped bd-1" key={index}>
                    <th scope="row" className="align-middle">{index + 1}</th>
                    <td className="align-middle">{cropedImage.label}</td>
                    <td className="align-middle">
                        <img className=" img-fluid" src={cropedImage.image}
                            alt="Images cropped" />
                    </td>
                    <td className="align-middle">{cropedImage.label}</td>
                    <td className="align-middle">{cropedImage.texto}</td>
                    <td className="align-middle">
                        <label className="deleteItemButton pl-1" onClick={() => { deleteItem(index) }}><FaWindowClose size={15} /></label>
                    </td>
                </tr>
            )
        })
    };

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    return (
        <div className="App">
            <div>
                <label htmlFor="inputImage" className="inputLabelImage">Enviar imagem</label>
                <input id="inputImage" className="inputImage" type="file" multiple accept="image/*" onChange={onSelectFile} />
            </div>
            <div className="imageCrop">
                {upImg !== undefined ? <h1 className="msgImagemSelect">Imagem Selecionada</h1> : ''}
                <ReactCrop
                    src={upImg}
                    onImageLoaded={onLoad}
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    style={{
                        maxWidth: '98%'
                    }}
                    imageStyle={{
                        maxHeight: '1000px',
                    }}
                />
            </div>
            <div>
                {completedCrop !== null ? <h1 className="msgImagemSelect">Preview Imagem selecionada</h1> : ''}
                <canvas
                    ref={previewCanvasRef}

                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0),
                        maxHeight: 'calc(95% - 3%)',
                        maxWidth: '98%',
                    }}
                />

            </div>

            {completedCrop !== null ?
                labelInputMessage()
                : ''}

            <button
                type="button"
                className="buttonSelectImage"
                disabled={disabled}
                onClick={() => {
                    let texto = document.getElementById('message_val').value;
                    let ImagesBase64 = addImageClipping(previewCanvasRef.current, completedCrop, cropImages, texto)
                    //Setar a imagem cortada
                    setCropImages(ImagesBase64)
                    //Limpar a área de seleção
                    setCompletedCrop(null)
                    setCrop({ unit: "%" })
                    setDisabled(true)
                }
                }
            >
                Selecionar Recorte
            </button>
            {cropImages.length !== 0 ? <h1 className="msgImagemCropped">Imagens Recortadas</h1> : ''}
            <div className="pt-4">
                <table className="table table-dark ">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Label</th>
                            <th scope="col">Image</th>
                            <th scope="col">Label OCR</th>
                            <th scope="col">Texto OCR</th>
                            <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cropImages.length !== 0 ?
                            previewSelections()
                            :
                            <tr>
                                <th scope="row">1</th>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="pt-4">

                {cropImages.length !== 0 ?
                    <button
                        type="button"
                        className="buttonSelectImage"

                    >Exportar treino</button> : ''}

            </div>


        </div>
    );
}
