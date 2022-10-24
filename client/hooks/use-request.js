import axios from 'axios'

import { useState } from 'react'

const useRequest = () => {
	const [errors, setErrors] = useState(null)

	const doRequest = async ({url, method, body, onSuccess}) => {
		try {
			setErrors(null)
			const response = await axios[method](url, body)
			console.log('success!')
			if (onSuccess) onSuccess(response.data)
			return response.data
		} catch(e) {
			console.log(e.response)
			setErrors(
				<div className ="alert alert-danger">
					<h4>Oooops...</h4>
					{e.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
				</div>
			)
		}
	}

	return {doRequest, errors}
}

export default useRequest