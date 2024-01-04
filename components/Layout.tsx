import { UserProvider } from "hooks/useUser"
import Head from "next/head"
import { theme } from "ooni-components"
import { ThemeProvider } from "styled-components"
import GlobalStyle from "./globalStyle"

import { Box } from "ooni-components"
import { getDirection } from "pages/_app"
import { useIntl } from "react-intl"
import meta from "../config/meta"
import Footer from "./Footer"

type LayoutProps = {
	title?: string
	children: React.ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
	const { locale } = useIntl()

	return (
		<div>
			<Head>
				<title>{title || meta.defaultTitle}</title>
				<meta httpEquiv="Content-Type" content={meta.contentType} />
				<meta name="viewport" content={meta.viewport} />
			</Head>
			<ThemeProvider theme={theme}>
				<GlobalStyle direction={getDirection(locale)} />
				<UserProvider>
					<Box
						sx={{
							minHeight: "100vh",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Box className="content">{children}</Box>
						<Footer />
					</Box>
				</UserProvider>
			</ThemeProvider>
		</div>
	)
}

export default Layout
