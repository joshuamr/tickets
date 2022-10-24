import { useEffect, useState} from 'react'
import useRequest from '../../hooks/use-request'

import Router from 'next/router'

const SignOut = () => {
	const {errors, doRequest} = useRequest()

	useEffect(() => {
		doRequest({
			method: 'post', 
			url: '/api/users/sign-out',
			body: {}, 
			onSuccess: () => Router.push('/') 
		})
		return
	}, [])

	
	return (
		<div>You are signing out...</div>
	)
}

export default SignOut