const styles = [
  { name: "Domyslny", path: "css/style1.css" },
  { name: "Responsywny", path: "css/style1.css" },
  { name: "Design", path: "css/style2.css" },
  { name: "Dodatkowy", path: "css/style3.css" },
];

document.addEventListener("DOMContentLoaded", () => {
  const styleDiv = document.getElementById("style-div");

  function changeStylesheet(styleSheetPath) {
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.type = "text/css";
    styleLink.href = styleSheetPath;
    styleLink.id = "dynamic-styles";

    const existingLink = document.getElementById("dynamic-styles");
    if (existingLink) {
      document.head.removeChild(existingLink);
    }

    document.head.appendChild(styleLink);
  }

  const defaultStylePath = styles[0].path;
  changeStylesheet(defaultStylePath);

  styles.map((style) => {
    const link = document.createElement("a");
    link.href = "#";
    link.innerText = style.name;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      changeStylesheet(style.path);
    });

    styleDiv ? styleDiv.appendChild(link) : console.error("Element with ID 'style-div' not found.");
  });
});