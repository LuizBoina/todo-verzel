import React from "react";
import { navigate, A, useTitle } from "hookrouter";
import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import api from '../../services/api';
import cpfMask from '../../utils/cpfMask';
import cepMask from '../../utils/cepMask';
import phoneNumberMask from '../../utils/phoneNumberMask';
import pt from 'date-fns/locale/pt-BR';
import cep from 'cep-promise';


import './index.css';

registerLocale('pt', pt);

export const SignUp = () => {
	useTitle('Cadastro');

	const initialState = {
		name: "",
		email: "",
		birthday: new Date(),
		cpf: "",
		cep: "",
		address: "",
		addressNumber: "",
		phoneNumber: "",
		password: "",
		

		isSubmitting: false,
		isSubmittingCep: false,
		errorMessage: null
	};

	const [data, setData] = React.useState(initialState);

	const handleInputChange = event => {
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	};

	const handleCpfChange = event => {
		setData({
			...data,
			cpf: cpfMask(event.target.value),
		});
	};

	const handleCepChange = event => {
		setData({
			...data,
			cep: cepMask(event.target.value),
		});
	};

	const handlePhoneChange = event => {
		setData({
			...data,
			phoneNumber: phoneNumberMask(event.target.value),
		});
	};

	const handleDateChange = date => {
		setData({
			...data,
			birthday: date,
		});
	}

	const searchCep = async () => {
		setData({
			...data,
			isSubmittingCep: true,
			errorMessage: null
		});
		if(data.cep.length < 9) {
			setData({
				...data,
				errorMessage: "Tamanho inválido de CEP"
			});
			return;
		}
		const _cep = data.cep.replace("-", "");
		try {
			const res = await cep(_cep);
			setAddress(res);
		} catch (err) {
			console.log(err);
		}
		setData({
			...data,
			isSubmittingCep: false
		});
	}

	const setAddress = res => {
		const address = `${res.street}, ${res.neighborhood}, ${res.city}, ${res.state}`;
		setData({
			...data,
			address: address
		});
	}

	const handleFormSubmit = async event => {
		event.preventDefault();
		setData({
			...data,
			isSubmitting: true,
			errorMessage: null
		});

		if (data.password.trim().length === 0 || data.email.trim().length === 0 || data.name.trim().length === 0
			|| data.birthday === null) {
			setData({
				...data,
				isSubmitting: false,
				errorMessage: "Complete todos os campos marcados com *"
			});
			return;
		}

		if(data.password.length <= 6) {
			setData({
				...data,
				isSubmitting: false,
				errorMessage: "Senha deve ser maior que 6 caracteres"
			});
			return;
		}
		if(data.phoneNumber > 0 && data.phoneNumber !== 15) {
			setData({
				...data,
				errorMessage: "Número de telefone inválido"
			});
			return;
		}
		let age = initialState.birthday.getFullYear() - data.birthday.getFullYear();
		const m = initialState.birthday.getMonth() - data.birthday.getMonth();
		if (m < 0 || (m === 0 && initialState.birthday.getDate() < data.birthday.getDate())) {
			age--;
		}

		if (age <= 12) {
			setData({
				...data,
				isSubmitting: false,
				errorMessage: "Apenas usuários maiores de 12 anos podem se cadastrar"
			});
			return;
		}

		data.phoneNumber = data.phoneNumber.replace(/\D/g, '');
		data.cpf = data.cpf.replace(/\D/g, '');
		data.cep = data.cep.replace(/\D/g, '');
		try {
			await api.post("/api/auth/signup", { 
						name: data.name,
						email: data.email,
						birthday: data.birthday,
						cpf: data.cpf,
						cep: data.cep,
						address: data.address,
						phoneNumber: data.phoneNumber,
						password: data.password
					});
			navigate("/login");
		} catch (err) {
			console.log(err);
			setData({
				 error: `Erro! ${err}` 
			});
		}
	};
	return (
		<div className="signup-container">
			<div className="card-store">
				<div className="container">
					<form onSubmit={handleFormSubmit}>
						<h1>Cadastrar</h1>

						<label htmlFor="name">
							Nome*
							<input
								type="text"
								value={data.name}
								onChange={handleInputChange}
								name="name"
								id="name"
								placeholder="Digite seu nome..."
							/>
						</label>

						<label htmlFor="email">
							Email*
							<input
								type="text"
								value={data.email}
								onChange={handleInputChange}
								name="email"
								id="email"
								placeholder="Digite seu email..."
							/>
						</label>

						<label htmlFor="birthday">
							Data de nascimento*
							<DatePicker
								id="birthday"
								name="birthday"
								dateFormat="P"
								locale='pt'
								className="date-field"
								selected={data.birthday}
								onChange={handleDateChange}
							/>
						</label>
						
						<label htmlFor="cpf">
							CPF
							<input
								maxLength='14'
								type="text"
								value={data.cpf}
								onChange={handleCpfChange}
								name="cpf"
								id="cpf"
								placeholder="Digite seu CPF..."
							/>
						</label>

						<div className="cep">
							<label htmlFor="cep">
								CEP
								<input
									maxLength='9'
									type="text"
									value={data.cep}
									onChange={handleCepChange}
									name="cep"
									id="cep"
									placeholder="Digite seu CEP..."
								/>
							</label>
							<button 
								disabled={data.isSubmittingCep} 
								type="button" 
								onClick={searchCep}
								>
									{data.isSubmittingCep ? (
									"Aguarde..."
									) : (
										"Buscar"
										)}
								</button>
						</div>

						<div className="address">
							<label className="address-text" htmlFor="address">
								Endereço
								<input
									type="text"
									value={data.address}
									onChange={handleInputChange}
									name="address"
									id="address"
									placeholder="Digite seu endereço..."
								/>
							</label>

							<label className="address-number" htmlFor="addressNumber">
								Número
								<input
									type="number"
									value={data.addressNumber}
									onChange={handleInputChange}
									name="addressNumber"
									id="addressNumber"
									placeholder="Digite o número..."
								/>
							</label>
						</div>

						<label htmlFor="phoneNumber">
							Telefone
							<input
								maxLength='15'
								type="text"
								value={data.phoneNumber}
								onChange={handlePhoneChange}
								name="phoneNumber"
								id="phoneNumber"	
								placeholder="(XX) XXXXX-XXXX"
							/>
						</label>

						<label htmlFor="password">
							Senha*
							<input
								type="password"
								value={data.password}
								onChange={handleInputChange}
								name="password"
								id="password"
								placeholder="Digite sua senha..."
							/>
						</label>

						{data.errorMessage && (
							<span className="form-error">{data.errorMessage}</span>
						)}
						<div className="signup-btn">
							<button disabled={data.isSubmitting}>
								{data.isSubmitting ? (
									"Carregando..."
									) : (
										"Criar"
										)}
							</button>
						</div>
						<hr />
						<A href='/login'>Já possui uma conta?</A>
					</form>
				</div>
			</div>
		</div>
	);
};
export default SignUp;