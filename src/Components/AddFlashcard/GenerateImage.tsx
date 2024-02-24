import { Button } from "@mui/material";
import axios from "axios";

type GenImageProps = {
  word: string;
  onItemList: (
    arr: { title: string; link: string; thumbnail: string }[]
  ) => void;
};

const GenerateImage = ({ word, onItemList }: GenImageProps) => {
  const getImage = async () => {
    try {
      const response: {
        data: { title: string; link: string; thumbnail: string }[];
      } = await axios.get(
        "https://australia-southeast1-ko-en-cards.cloudfunctions.net/Ko-En-Cards",
        {
          params: { word: word },
        }
      );
      if (response.data.length === 0) {
        alert("Couldn't find any images.");
      } else {
        onItemList(response.data.slice(0, -1)); //only show 9 images for 3x3
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
    }
  };

  return <Button onClick={getImage}>Image Search</Button>;
};

export default GenerateImage;
