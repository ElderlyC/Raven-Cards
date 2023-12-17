import React from "react";

type Props = { words: string[] };
const Wordlist = ({ words }: Props) => {
  return <li>{words[0] + words[1]}</li>;
};

export default Wordlist;
