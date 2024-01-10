import React from "react";
import { WordPair } from "../../types";
// display a list of transpairs, delete and add card buttons.
// list is saved in localStorage, added cards in a separate localStorage var.
// structure: wordlist: [ {source: cat, target: 고양이}, {source: dog, target: 개} ]
// structure: added cards: [ {card1data}, {card2data} ]

type WordListProps = {
  wordlist: WordPair[];
  handleRemovePair: (source: string) => void;
};

const Wordlist: React.FC<WordListProps> = ({ wordlist, handleRemovePair }) => {
  const handleDeletePair = (source: string) => {
    handleRemovePair(source);
  };

  return (
    <div>
      {wordlist.map((pair) => (
        <div key={pair.source + Math.random() * 10000}>
          <span>{pair.source}</span>
          <input defaultValue={pair.target} />
          <button onClick={() => handleDeletePair(pair.source)}>Delete</button>
          <button>Add Flashcard!</button>
        </div>
      ))}
    </div>
  );
};

export default Wordlist;
