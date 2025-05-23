import blessed from "blessed"

export function loginForm(
	screen: blessed.Widgets.Screen,
	onSubmit: (data: { username: string; password: string }) => void,
) {
	const loginForm = blessed.form({
		parent: screen,
		width: "100%",
		keys: true,
		vi: true,
	})

	blessed.text({
		parent: loginForm,
		content: "Login to Second Life",
		top: 0,
		style: {
			fg: "white",
		},
	})

	blessed.text({
		parent: loginForm,
		content: "Tip: Press escape at any time to quit (may take two presses)",
		top: 1,
		style: {
			fg: "gray",
		},
	})

	const usernameField = blessed.textbox({
		parent: loginForm,
		name: "username",
		label: "Username",
		top: 3,
		height: 3,
		keys: true,
		vi: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			border: {
				fg: "gray",
			},
			focus: {
				border: {
					fg: "cyan",
				},
			},
		},
	})

	const passwordField = blessed.textbox({
		parent: loginForm,
		name: "password",
		label: "Password",
		top: 6,
		height: 3,
		keys: true,
		vi: true,
		censor: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			border: {
				fg: "gray",
			},
			focus: {
				border: {
					fg: "cyan",
				},
			},
		},
	})

	// const rememberUsernameCheckbox = blessed.checkbox({
	// 	name: "rememberUsername",
	// 	parent: loginForm,
	// 	content: "Remember username",
	// 	top: 9,
	// 	left: 0,
	// 	style: {
	// 		focus: {
	// 			fg: "cyan",
	// 		},
	// 	},
	// })

	// const rememberPasswordCheckbox = blessed.checkbox({
	// 	name: "rememberPassword",
	// 	parent: loginForm,
	// 	content: "Remember password",
	// 	top: 10,
	// 	left: 0,
	// 	style: {
	// 		focus: {
	// 			fg: "cyan",
	// 		},
	// 	},
	// })

	// const rememberStartLocationCheckbox = blessed.checkbox({
	// 	name: "rememberStartLocation",
	// 	parent: loginForm,
	// 	content: "Remember start location",
	// 	top: 11,
	// 	left: 0,
	// 	style: {
	// 		focus: {
	// 			fg: "cyan",
	// 		},
	// 	},
	// })

	const submitButton = blessed.button({
		parent: loginForm,
		content: "Login",
		top: 9,
		right: 0,
		align: "center",
		width: 11,
		height: 3,
		mouse: true,
		keys: true,
		vi: true,
		border: {
			type: "line",
		},
		style: {
			fg: "white",
			hover: {
				fg: "cyan",
			},
			focus: {
				fg: "cyan",
				border: {
					fg: "cyan",
				},
			},
		},
	})

	if (process.env.SL_USERNAME) {
		usernameField.setValue(process.env.SL_USERNAME)
	}

	if (process.env.SL_PASSWORD) {
		passwordField.setValue(process.env.SL_PASSWORD)
	}

	usernameField.key(["enter"], () => {
		passwordField.focus()
	})

	passwordField.key(["enter"], () => {
		loginForm.submit()
	})

	submitButton.on("press", () => {
		loginForm.submit()
	})

	submitButton.on("click", () => {
		loginForm.submit()
	})

	submitButton.key(["enter"], () => {
		loginForm.submit()
	})

	loginForm.key(["enter"], () => {
		loginForm.submit()
	})

	let isSubmitting = false

	loginForm.on("submit", (data: { username: string; password: string }) => {
		const { username, password } = data

		if (!username || !password || isSubmitting) {
			return
		}

		isSubmitting = true

		loginForm.hide()
		loginForm.destroy()

		screen.render()

		onSubmit(data)
	})

	return loginForm
}
