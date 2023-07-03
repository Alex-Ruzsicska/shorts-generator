import { PinturaEditor } from '@pqina/react-pintura';
import { getEditorDefaults } from '@pqina/pintura';

import '@pqina/pintura/pintura.css';

export default function App() {
  const [editorResult, setEditorResult] = useState(undefined);

  const handleProcessMedia = (res) => {
    // Get a reference to the file object
    const { dest } = res;

    // Set an ObjectURL to the file object
    setEditorResult(URL.createObjectURL(dest));
  };

  return (
    <div style={divStyle}>
      {editorResult && <img src={editorResult} alt='' />}

      <PinturaEditor
        {...editorConfig}
        src='./my-image.jpeg'
        imageCropAspectRatio={1}
        onProcess={handleProcessMedia}
      ></PinturaEditor>
    </div>
  );
}
