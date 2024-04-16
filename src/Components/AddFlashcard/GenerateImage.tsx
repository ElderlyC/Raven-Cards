import { useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { pageContent } from "./GenerateImageText";
import SearchIcon from "@mui/icons-material/Search";

// handle using different sources of images (for en/jp searches)

type GenImageProps = {
  displayLang: string;
  word: string;
  onItemList: (
    arr: { title: string; link: string; thumbnail: string }[]
  ) => void;
};

const GenerateImage = ({ displayLang, word, onItemList }: GenImageProps) => {
  const textContent = pageContent[displayLang];
  const [loading, setLoading] = useState(false);
  const getImage = async () => {
    try {
      setLoading(true);
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
        if (response.data.length > 9)
          onItemList(response.data.slice(0, 9)); //only show up to 9 images
        else onItemList(response.data);
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={getImage}
      variant="outlined"
      sx={{ minWidth: "130px", paddingLeft: "25px" }}
    >
      {loading ? textContent.imageButtonLoading : textContent.imageSearchButton}
      <SearchIcon sx={{ marginLeft: "5px" }} />
    </Button>
  );
};

export default GenerateImage;
