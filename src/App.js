import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';


function App() {
  const baseUrl="http://localhost/apilibreria/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado]= useState({
    id: '',
    titulo: '',
    autor: '',
    editorial: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);      
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("titulo", frameworkSeleccionado.titulo);
    f.append("autor", frameworkSeleccionado.autor);
    f.append("editorial", frameworkSeleccionado.editorial);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }
  const peticionPut=async()=>{
    var f = new FormData();
    f.append("titulo", frameworkSeleccionado.titulo);
    f.append("autor", frameworkSeleccionado.autor);
    f.append("editorial", frameworkSeleccionado.editorial);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      var dataNueva = data;
      // eslint-disable-next-line array-callback-return
      dataNueva.map(framework=>{
        if(framework.id===frameworkSeleccionado.id){
          framework.titulo=frameworkSeleccionado.titulo;
          framework.autor=frameworkSeleccionado.autor;
          framework.editorial=frameworkSeleccionado.editorial;          
        }
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div style={{textAlign: 'center'}}>
      <br/>
          <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>INSERTAR</button>
          <br/><br/>
        <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>TITULO</th>
            <th>AUTOR</th>
            <th>EDITORIAL</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {data.map(framework=>(
            <tr key={framework.id}>
              <td>{framework.id}</td>
              <td>{framework.titulo}</td>
              <td>{framework.autor}</td>
              <td>{framework.editorial}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button>{"   "}
                <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
              </td>
            </tr>
          ))}

        </tbody>

        </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Desea Insertar el Libro ?</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>titulo: </label>
            <br />
            <input type="text" className="form-control" name="titulo" onChange={handleChange}/>
            <br />
            <label>autor: </label>
            <br />
            <input type="text" className="form-control" name="autor" onChange={handleChange}/>
            <br />
            <label>editorial: </label>
            <br />
            <input type="text" className="form-control" name="editorial" onChange={handleChange}/>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
          <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
        </ModalFooter>
        </Modal>  

        <Modal isOpen={modalEditar}>
          <ModalHeader>Desea Editar el Libro ?</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>titulo: </label>
              <br />
              <input type="text" className="form-control" name="titulo" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.titulo}/>
              <br />
              <label>autor: </label>
              <br />
              <input type="text" className="form-control" name="autor" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.autor}/>
              <br />
              <label>editorial: </label>
              <br />
              <input type="text" className="form-control" name="editorial" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.editorial}/>
              <br />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
          </ModalFooter>
          </Modal>   

          <Modal isOpen={modalEliminar}>
            <ModalBody>
              ¿Estás bien seguro que deseas eliminar el Libro {frameworkSeleccionado && frameworkSeleccionado.titulo}?
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>peticionDelete()}>
                Si
              </button>
              <button
                className="btn btn-secondary"
                onClick={()=>abrirCerrarModalEliminar()}
                >
                  No
                </button>
            </ModalFooter>
            </Modal>       
        
    </div>
  );
}

export default App;
