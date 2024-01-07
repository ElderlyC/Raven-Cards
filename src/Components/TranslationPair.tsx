import classes from "./TranslationPair.module.css";

type Props = {
  source: string;
  target: string;
  onDelete: (source: string) => void;
  onGenerate: (link: string) => void;
};

const TranslationPair = ({ source, target, onDelete, onGenerate }: Props) => {
  const handleRemovePair = () => {
    onDelete(source);
  };

  const getImage = () => {
    // should check if a different button has been clicked or the same (counter=0 when diff)
    // or a grid of images, user can pick 1 (module)
    fetch(`http://localhost:3001/api/searchImage?query=${source}`)
      .then((response) => response.json())
      .then((data) => {
        onGenerate(data.items);
      });
  };

  return (
    <div className={classes.container}>
      <span>{source}</span>
      <input defaultValue={target} className={classes.input} />
      <button onClick={handleRemovePair}>Delete</button>
      <button>Add Flashcard!</button>
      <button onClick={getImage}>Generate Image</button>
    </div>
  );
};

export default TranslationPair;
