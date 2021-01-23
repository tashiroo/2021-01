let counter = 0;
let dom = document.querySelector("#root");
doCount();

function doCount() {
  let element = React.createElement("div",{},
   React.createElement("h2",{},"Hello!"),
   React.createElement("h3",{},"React sample Page"),
   React.createElement("ul",{},
   React.createElement("li",{},"First item"),
   React.createElement("li",{},"Second item"),
   React.createElement("li",{},"Third item"),
   ),
  );
  ReactDOM.render(element,dom);
}