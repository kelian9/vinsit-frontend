export default [
    {
        path: '/clients',
        name: 'clients',
        component: () => import(/* webpackChunkName: clients */ '@/views/clients/Clients.vue'),
        meta: {
            pageTitle: 'Контрагенты',
            breadcrumb: [
                {
                    text: 'Контрагенты',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/clients/:id(\\d+)',
        name: 'client',
        component: () => import(/* webpackChunkName: clients */ '@/views/clients/Client.vue'),
        meta: {
            navActiveLink: 'clients',
            breadcrumb: [
                {
                    text: 'Контрагенты',
                    to: "/clients"
                },
                {
                    text: 'Контрагент',
                    active: true,
                },
            ],
        },
    },
]
