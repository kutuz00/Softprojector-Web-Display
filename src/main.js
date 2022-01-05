const server = io();
const liveGraphicBlock = document.querySelector(".sp-text");
const reference = document.querySelector(".reference");
// client-side
const defaultState = () => {
  liveGraphicBlock.textContent = " ";
  reference.textContent = " ";
};
server
  .on("softpojector", (data) => {
    const type = Object.keys(data.softprojector);
    switch (type[0]) {
      case "bible":
        liveGraphicBlock.textContent = data.softprojector.bible[0].verse;
        reference.textContent = data.softprojector.bible[0].reference;
        break;
      case "song":
        liveGraphicBlock.textContent = data.softprojector.song.stanza;
        reference.textContent = data.softprojector.song.number;
        console.log(data);
        break;
      default:
        defaultState();
        break;
    }
  })
  .on("err", (err) => {
    defaultState();
    console.log(err);
  })
  .on("sp-error", (err) => {
    defaultState();
    console.log(err);
  });
