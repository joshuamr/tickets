import axios from 'axios'
import buildClient from '../api/build-client'

function LandingPage ({currentUser})  {
	if (currentUser) {
		return <h1>You are signed in.</h1>
	}
	return <h1>You are not signed in.</h1>
}

LandingPage.getInitialProps = async (ctx) => {
	const client = buildClient(ctx)
	const { data } = await client.get('/api/users/current-user')
	return data

}

export default LandingPage