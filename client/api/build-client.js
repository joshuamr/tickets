import axios from 'axios'


export default ({req}) => {
if (typeof window === 'undefined') {
		// on server, need to use cluster ip
		// http://SERVICE_NAME.NAMESPACE.svc.cluster.local
		// kubectl get namespaces GETS THE NAMESPACE
		// kubectl get services -n ingress-nginx GETS THE SERVICE NAME for namespace ingress-nginx

		return  axios.create({
			baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/', 
			headers: req.headers
		})
	} else {
		return axios.create({
			baseUrl: '/'
		})
	}
}