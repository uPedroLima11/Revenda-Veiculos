import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

function App() {
  const { register, handleSubmit, reset, setFocus, watch } = useForm();

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [veiculos, setveiculos] = useState([]);

  const [modalModel, setModalModel] = useState("");
  const [modalBrand, setModalBrand] = useState("");
  const [modalAno, setModalAno] = useState("");
  const [modalprice, setModalprice] = useState("");
  const [modalPhoto, setModalPhoto] = useState("");

  
  const [filterBrand, setFilterBrand] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterAnoMinimo, setFilterAnoMinimo] = useState('');
  const [filterAnoMaximo, setFilterAnoMaximo] = useState('');
  const [filterMinimoPreco, setFilterMinimoPreco] = useState('');
  const [filterMaxPreco, setFilterMaxPreco] = useState('');

  function onOpenModal() {
    setOpen(true);
  }

  function onCloseModal() {
    setOpen(false);
  }

  function onOpenModal2() {
    setOpen2(true);
  }

  function onCloseModal2() {
    setOpen2(false);
  }

  function gravaDados(data) {
    const veiculosCopy = [...veiculos];
    veiculosCopy.push({
      model: data.model,
      brand: data.brand,
      ano: data.ano,
      price: data.price,
      photo: data.photo,
    });
    setveiculos(veiculosCopy);
    setFocus("model");
    reset({ model: "", brand: "", ano: "", price: "", photo: "" });

    localStorage.setItem("veiculos", JSON.stringify(veiculosCopy));
    onCloseModal(); 
  }

  function mostraVeiculo(indice) {
    const veiculos1 = veiculos[indice];
    setModalModel(veiculos1.model);
    setModalBrand(veiculos1.brand);
    setModalAno(veiculos1.ano);
    setModalprice(veiculos1.price);
    setModalPhoto(veiculos1.photo);
    setOpen2(true);
  }

  function excluiVeiculo(indice) {
    if (window.confirm("Deseja Excluir esse veículo?")) {
      const veiculosCopy = [...veiculos];
      veiculosCopy.splice(indice, 1);
      setveiculos(veiculosCopy);
      localStorage.setItem("veiculos", JSON.stringify(veiculosCopy));
    }
  }

  function mostrarEstatisticas() {
    const numeroDeVeiculos = veiculos.length;
    const precoMedio =
      veiculos.reduce((total, veiculos1) => total + veiculos1.price, 0) /
      numeroDeVeiculos;
    const veiculoMaisCaro = veiculos.reduce((max, veiculos1) =>
      max.price > veiculos1.price ? max : veiculos1
    );
    const estatisticas = `Número de veículos: ${numeroDeVeiculos}\nPreço médio dos veículos: ${precoMedio.toFixed(2
    )}\nVeículo mais caro: ${veiculoMaisCaro.model}, Preço: ${veiculoMaisCaro.price}`;

    alert(estatisticas);
  }

  useEffect(() => {
    if (localStorage.getItem("veiculos")) {
      const veiculosFromStorage = JSON.parse(localStorage.getItem("veiculos"));
      setveiculos(veiculosFromStorage);
    }
  }, []);

  const handleFilterClick = () => {
    const brand = prompt('Filtrar por marca:');
    setFilterBrand(brand);
    const model = prompt('Filtrar por modelo:');
    setFilterModel(model);
    const AnoMinimo = prompt('Filtrar por ano mínimo:');
    setFilterAnoMinimo(AnoMinimo);
    const AnoMaximo = prompt('Filtrar por ano máximo:');
    setFilterAnoMaximo(AnoMaximo);
    const MinimoPreco = prompt('Filtrar por preço mínimo:');
    setFilterMinimoPreco(MinimoPreco);
    const MaxPreco = prompt('Filtrar por preço máximo:');
    setFilterMaxPreco(MaxPreco);
  };

  const clearFilter = () => {
    setFilterBrand('');
    setFilterModel('');
    setFilterAnoMinimo('');
    setFilterAnoMaximo('');
    setFilterMinimoPreco('');
    setFilterMaxPreco('');
  };

  const filteredVeiculos = veiculos.filter((veiculos1) => {
    const ano = parseInt(veiculos1.ano);
    const price = parseFloat(veiculos1.price);

    const brandMatch = !filterBrand || veiculos1.brand.toLowerCase() === filterBrand.toLowerCase();
    const modelMatch = !filterModel || veiculos1.model.toLowerCase() === filterModel.toLowerCase();
    const AnoMinimoMatch = !filterAnoMinimo || ano >= parseInt(filterAnoMinimo);
    const AnoMaximoMatch = !filterAnoMaximo || ano <= parseInt(filterAnoMaximo);
    const MinimoPrecoMatch = !filterMinimoPreco || price >= parseFloat(filterMinimoPreco);
    const MaxPrecoMatch = !filterMaxPreco || price <= parseFloat(filterMaxPreco);

    return brandMatch && modelMatch && AnoMinimoMatch && AnoMaximoMatch && MinimoPrecoMatch && MaxPrecoMatch;
  });

  return (
    <div className="">
      <nav className="navbar bg-danger navbar-expand">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvlaEZVibqUkEEdvVWmhdW7Lz6qnX4sY8SME1DXShLMUMkJHtsnujyZMG-afZVaM_oZWE&usqp=CAU"
              alt="Logo"
              width="68"
              height="60"
              className="d-inline-block align-text-top me-3"
            />
            App Revenda de Veículos
          </a>
        </div>
      </nav>

      <div className="container mt-2">
        <h2 className="d-flex justify-content-between">
          <span>Listagem de Veículos Disponíveis</span>
          <button className="btn btn-primary" onClick={onOpenModal}>
            Adicionar Veículo
          </button>
          <button className="btn btn-info" onClick={mostrarEstatisticas}>
            Estatísticas
          </button>
        </h2>

        <div>
          <button className="btn btn-primary" onClick={handleFilterClick}>
            Filtrar
          </button>
          <button className="btn btn-secondary" onClick={clearFilter}>
            Ver Todos
          </button>
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Ano</th>
              <th>Preço</th>
              <th>Foto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredVeiculos.map((veiculos1, indice) => (
              <tr key={indice}>
                <td>{veiculos1.model}</td>
                <td>{veiculos1.brand}</td>
                <td>{veiculos1.ano}</td>
                <td>{veiculos1.price}</td>
                <td>
                  <img
                    src={veiculos1.photo}
                    alt={`Foto do Veículo ${veiculos1.model}`}
                    width={150}
                    height={100}
                  />
                </td>
                <td>
                  <i
                    className="bi bi-search fs-4 text-info me-2"
                    title="Consultar"
                    style={{ cursor: "pointer" }}
                    onClick={() => mostraVeiculo(indice)}
                  ></i>
                  <i
                    className="bi bi-x-circle fs-4 text-danger"
                    title="Excluir"
                    style={{ cursor: "pointer" }}
                    onClick={() => excluiVeiculo(indice)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <div className="card">
          <div className="card-header">Inclusão de Veículos no Catálogo</div>
          <form className="card-body" onSubmit={handleSubmit(gravaDados)}>
            <h5 className="card-title">Informe os Detalhes do Veículo </h5>
            <div className="mb-3">
              <label htmlFor="model" className="form-label">
                Modelo do Veículo:
              </label>
              <input
                type="text"
                className="form-control"
                id="model"
                required
                {...register("model")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="brand" className="form-label">
                Marca do Veículo:
              </label>
              <input
                type="text"
                className="form-control"
                id="brand"
                required
                {...register("brand")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="ano" className="form-label">
                Ano do Veículo:
              </label>
              <input
                type="number"
                className="form-control"
                id="ano"
                required
                {...register("ano")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Preço do Veículo:
              </label>
              <input
                type="number"
                className="form-control"
                id="price"
                required
                {...register("price")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                URL da Foto do Veículo:
              </label>
              <input
                type="url"
                className="form-control"
                id="photo"
                required
                {...register("photo")}
              />
            </div>
            <input
              type="submit"
              value="Enviar"
              className="btn btn-primary px-5"
            />
          </form>
          {watch("photo") && (
            <img
              src={watch("photo")}
              alt="Foto do Veículo"
              width={240}
              height={200}
              className="rounded mx-auto d-block"
            />
          )}
        </div>
      </Modal>

      <Modal open={open2} onClose={onCloseModal2} center>
        <div className="card">
          <img
            src={modalPhoto}
            className="card-img-top"
            alt="Veículo"
            width={500}
            height={400}
          />
          <div className="card-body">
            <h5 className="card-title">{modalModel}</h5>
            <p className="card-text">
              <strong>Marca:</strong> {modalBrand}
              <br />
              <strong>Ano:</strong> {modalAno}
              <br />
              <strong>Preço:</strong> {modalprice}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;