const COMPONENT_NAME_LOADING = 'c-loading'

Vue.component(COMPONENT_NAME_LOADING, {
    functional: true,
    props: {
        size: {
            type: Number
        }
    },
    render(h, ctx) {
        const blades = []
        for (let i = 0; i < 12; i++) {
            blades.push(h('i', {
                class: 'c-loading-spinner'
            }))
        }
        return h('div', {
            class: 'c-loading'
        }, [
            h('span', {
                class: 'c-loading-spinners',
                style: ctx.props.size ? {
                    width: `${ctx.props.size}px`,
                    height: `${ctx.props.size}px`
                } : undefined
            }, blades)
        ])
    }
})