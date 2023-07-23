import { CreateTestimonyDto } from '../../modules/testimony/dto/create-testimony.dto';

export const dataFormatter = (obj: CreateTestimonyDto) => {
  obj.userName =
    obj.userName[0].toUpperCase() + obj.userName.slice(1, obj.userName.length);

  const testimonyText = obj.description.split(' ');

  let count = 0;
  for (let i = 0; i < testimonyText.length; i++) {
    if (testimonyText[i]) {
      count = count + 1;
      if (count === 1) {
        obj.description =
          testimonyText[i][0].toUpperCase() +
          testimonyText[i].slice(1, testimonyText.length) +
          ' ';
      }
      if (count > 1) {
        obj.description += testimonyText[i] + ' ';
      }
    }
  }
};

export const dateFormatter = () => {
  const dateYear = new Date().getFullYear();
  const dateMonth = new Date().getMonth();
  const dateDay = new Date().getDate();
  const dateHour = new Date().getHours();
  const dateMinutes = new Date().getMinutes();

  const formattedDate = `${dateYear}/${dateMonth}/${dateDay} ${dateHour}:${dateMinutes}`;

  return formattedDate;
};
