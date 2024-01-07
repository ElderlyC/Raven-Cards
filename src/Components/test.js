import * as papago from "papago-translate";

const Test = () => {
  papago
    .translate("안녕하세요, 나는 사람입니다.", { from: "ko", to: "en" })
    .then((res) => console.log(res.translatedText))
    .catch((err) => console.error(err));

  return <div>test</div>;
};

export default Test;
