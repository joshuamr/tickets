import Link from 'next/link'

const Header = ({currentUser}) => {
	const links = [
		{label: 'Sign Up', href: '/auth/sign-up'},
		{label: 'Sign In', href: '/auth/sign-in'},
		{label: 'Sign Out', href: '/auth/sign-out', isSignedIn: true},
	]

	const linksToShow = currentUser ? links.filter(link => link.isSignedIn) : links.filter(link => !link.isSignedIn)

	const displayLinks = linksToShow.map(link => {
		return (
			<li key={link.label} className="nav-item">
				<Link href={link.href}>
					<a className="nav-link">{link.label}</a>
				</Link>
			</li>
		)
	})
	
	return <nav className="navbar navbar-light bg-light">
		<Link href='/'>
			<a className = "navbar navbar-brand">GitTix</a>
		</Link>
		<div className="d-flex justify-content-end">
			<ul className="nav d-flex align-items-center">
				{displayLinks}
			</ul>

		</div>
	</nav>
}

export default Header