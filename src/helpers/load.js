// EXPORT
const exportFile = (filename, objects) => {  
    if (!filename) {
      filename = 'model';
    }
  
    const data = JSON.stringify(objects);
    download(filename + '.json', data);
    
    console.log('Exported to ' + filename + '.json')
  };

const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
};


// IMPORT
// const importFile = (file, objects) => {
//     const file = file.files[0];
//     const reader = new FileReader();
  
//     reader.onload = function (e) {
//       console.log('file imported');
//       const toAppend = JSON.parse(e.target.result);
  
//       for (let i = 0; i < toAppend.length; i++) {
//         const newID = objects.length;
//         if (toAppend[i].type == 'Line') {
//           objects.push(new Line(newID));
//         } else if (toAppend[i].type == 'Square') {
//           objects.push(new Square(newID));
//         } else if (toAppend[i].type == 'Rectangle') {
//           objects.push(new Rectangle(newID));
//         } else if (toAppend[i].type == 'Polygon') {
//           objects.push(new Polygon(newID));
//         }
//         objects[newID].copy(toAppend[i]);
//       }
//       refreshObjectsList();
//     };
// }



export { download, exportFile };