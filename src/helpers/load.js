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



export { download, exportFile };