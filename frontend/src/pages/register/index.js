import React, {useState} from 'react';
import { navigate } from 'hookrouter';
import { FiArrowLeft } from 'react-icons/fi'
import LogoImg from '../../assets/logo.svg';
import api from '../../services/api';
import './styles.css';

const Register = () => {
    const initialState = {
        name: '',
        email: '',
        whatsapp: '',
        city: '',
        uf: ''
    };
    const [state, setState] = useState(initialState);
    const handleRegister = async e => {
        e.preventDefault();
        
        try {
            const response  = await api.post('ongs', state, { useCredentails: true });
            alert(`Seu ID de acesso: ${response.data.id}`);
            navigate('/');
        }
        catch (err) {
            console.log(err);
        }
    };
    const handleInputChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value,
        });
    };
    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <img src={LogoImg} alt="Be The Hero" />
                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem os casos da sua ONG.</p>
                    
                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041"/>
                        Não tenho cadastro
                </Link>
                </section>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Nome da ONG"
                        name="name"
                        value={state.name} 
                        onChange={handleInputChange}/>

                    <input type="email" placeholder="E-mail"
                        name="email"
                        value={state.email} 
                        onChange={handleInputChange}/>

                    <input type="text" placeholder="Whatsapp"
                         name="whatsapp"
                         value={state.whatsapp} 
                         onChange={handleInputChange}/>

                    <div className="input-group">
                        <input type="text" placeholder="Cidade"
                            name="city"
                            value={state.city} 
                            onChange={handleInputChange}/>

                        <input type="text" placeholder="UF" 
                            style={{width: 80}} 
                            name="uf"
                            value={state.uf}
                            onChange={handleInputChange}/>
                    </div>
                    <button className="button" type="submit">
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;