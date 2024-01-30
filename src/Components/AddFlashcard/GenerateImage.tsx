import { useState } from "react";
import { Button, Typography, TextField, Box } from "@mui/material";

type GenImageProps = {
  word: string;
  onGenerate: (link: string) => void;
  onItemList: (arr: []) => void;
};

const GenerateImage = ({ word, onGenerate, onItemList }: GenImageProps) => {
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState([{ link: "" }]);
  const getImage = () => {
    // image set to counter = 1, should set before counter++
    setCounter((p) => p + 1);
    // should check if a different button has been clicked or the same (counter=0 when diff)
    // or a grid of images, user can pick 1 (module)
    if (counter === data.length - 1) setCounter(0);
    if (data[0].link) {
      onGenerate(data[counter].link);
    } else {
      fetch(`http://localhost:3001/api/searchImage?query=${word}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data.items);
          onGenerate(data.items[0].link);
          onItemList(data.items);
        });
    }
  };
  console.log(data);
  return (
    <Button onClick={getImage}>
      {data[counter].link ? "New Image" : "Image Search"}
    </Button>
  );
};

export default GenerateImage;
