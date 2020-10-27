export const searchBtnConfig = [
    {
        container: {
            position: 'right',
            component: {
                props: {
                    width: 86,
                },
                hooks: [
                    {
                        name: 'onSearch',handle: (value) => {
                            // @ts-ignore
                            that.handleSearch(value)
                        },
                    },
                    {
                        name: 'onReset',handle: (value) => {
                            // @ts-ignore
                            that.handleReset(value)
                        },
                    },
                ],
            },
        },
    },
]