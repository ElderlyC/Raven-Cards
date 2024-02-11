import { useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";

// reformat to focus on imagelist: don't need a counter
// choose an image to attach to card: a part of 'hints'

type GenImageProps = {
  word: string;
  onGenerate: (link: string) => void;
  onItemList: (arr: { title: string; link: string }[]) => void;
};

const GenerateImage = ({ word, onGenerate, onItemList }: GenImageProps) => {
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState([{ link: "" }]);

  const getImage = async () => {
    // image set to counter = 1, should set before counter++
    setCounter((p) => p + 1);
    // should check if a different button has been clicked or the same (counter=0 when diff)
    // or a grid of images, user can pick 1 (module)
    if (counter === data.length - 1) setCounter(0);
    if (data[0].link) {
      onGenerate(data[counter].link);
    } else {
      try {
        const response: { data: { title: string; link: string }[] } =
          await axios.get("http://localhost:3002/images", {
            params: { word: word },
          });

        setData(response.data);
        onGenerate(response.data[0].link);
        onItemList(response.data);
      } catch (error) {
        console.error("Error fetching definition:", error);
      }
    }
  };
  return (
    <Button onClick={getImage}>
      {data[counter].link ? "New Image" : "Image Search"}
    </Button>
  );
};

export default GenerateImage;
