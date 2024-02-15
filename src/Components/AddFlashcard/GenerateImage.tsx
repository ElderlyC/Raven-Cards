import { Button } from "@mui/material";
import axios from "axios";

type GenImageProps = {
  word: string;
  onItemList: (arr: { title: string; link: string }[]) => void;
};

const GenerateImage = ({ word, onItemList }: GenImageProps) => {
  const getImage = async () => {
    try {
      const response: { data: { title: string; link: string }[] } =
        await axios.get("http://localhost:3002/images", {
          params: { word: word },
        });

      onItemList(response.data);
    } catch (error) {
      console.error("Error fetching definition:", error);
    }
  };

  return <Button onClick={getImage}>Image Search</Button>;
};

export default GenerateImage;
