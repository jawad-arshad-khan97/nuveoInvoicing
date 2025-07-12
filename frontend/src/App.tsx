import {Authenticated, Refine} from "@refinedev/core";
import {
    useNotificationProvider,
    ThemedLayoutV2,
    ErrorComponent,
    AuthPage,
} from "@refinedev/antd";
import routerProvider, {
    NavigateToResource,
    UnsavedChangesNotifier,
    DocumentTitleHandler,
    CatchAllNavigate,
} from "@refinedev/react-router-v6";
import {BrowserRouter, Routes, Route, Outlet} from "react-router-dom";
import {DevtoolsPanel, DevtoolsProvider} from "@refinedev/devtools";
import {App as AntdApp, Spin} from "antd";
import {Header} from "@/components/header";
import {Logo} from "@/components/logo";
import {
    AccountsPageList,
    AccountsPageCreate,
    AccountsPageEdit,
} from "@/pages/accounts";
import {
    ClientsPageList,
    ClientsPageCreate,
    ClientsPageEdit,
} from "@/pages/clients";
import {
    InvoicePageList,
    InvoicesPageCreate,
    SimplifiedInvoiceForm,
    StandardInvoiceForm,
    InvoicesPageShow,
} from "@/pages/invoices";
import {
    EventsPageList,
    EventsPageCreate,
    EventsPageEdit,
} from "@/pages/events";
import {
    ClientMediaPageList,
    ClientMediaPageCreate,
    ClientMediaPageEdit,
} from "@/pages/clientmedia";
import {DashboardPage} from "./pages/dashboard";
import dataProvider from "@refinedev/simple-rest";
import {authProvider} from "@/providers/auth-provider";
import {ConfigProvider} from "@/providers/config-provider";
import "@refinedev/antd/dist/reset.css";
import "./styles/custom.css";
import {InvoicesPageEdit} from "./pages/invoices/edit";
import {ThemedSiderV2} from "./components/sider/sider";
import {ThemedTitleV2} from "./components/sider/title";
import {
    BankOutlined,
    ShopOutlined,
    ContainerOutlined,
    FolderOutlined,
    TeamOutlined,
    FileAddOutlined,
    AuditOutlined,
    DashboardOutlined, FieldTimeOutlined,
} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {Login} from "./providers/auth-provider/login";
import axios from "axios";
import {BASE_URL_API_V1} from "./utils/urls";
import {
    ListSimplifiedInvoices,
    ListStandardInvoices,
    ShowSimplifiedInvoice,
    ShowStandardInvoice,
    EditSimplifiedInvoice,
    EditStandardInvoice,
} from "@/pages/invoices";

const App: React.FC = () => {
    const {isLoading, user, logout, getIdTokenClaims} = useAuth0();

    if (isLoading) {
        return <Spin size="large" fullscreen={true} delay={200}/>;
    }

    const createProvider = authProvider(user, logout, getIdTokenClaims);

    return (
        <BrowserRouter
            future={{
                v7_startTransition: true,
            }}
        >
            <ConfigProvider>
                <AntdApp>
                    <Refine
                        routerProvider={routerProvider}
                        authProvider={createProvider}
                        dataProvider={dataProvider(BASE_URL_API_V1)}
                        resources={[
                            {
                                name: "dashboard",
                                list: "/",
                                meta: {
                                    label: "Dashboard",
                                    icon: <DashboardOutlined/>,
                                },
                            },
                            {
                                name: "Invoicing",
                                icon: <AuditOutlined/>,
                                meta: {
                                    label: "Invoicing",
                                },
                            },
                            {
                                name: "Archive",
                                icon: <FolderOutlined/>,
                                meta: {
                                    label: "Archive",
                                },
                            },
                            {
                                name: "accounts",
                                list: "/accounts",
                                create: "/accounts/new",
                                edit: "/accounts/:id/edit",
                                meta: {
                                    parent: "Invoicing",
                                },
                                icon: <BankOutlined/>,
                            },
                            {
                                name: "clients",
                                list: "/clients",
                                create: "/clients/new",
                                edit: "/clients/:id/edit",
                                meta: {
                                    parent: "Invoicing",
                                },
                                icon: <TeamOutlined/>,
                            },
                            {
                                name: "invoices",
                                list: "/invoices",
                                show: "/invoices/:id",
                                create: "/invoices/new",
                                edit: "/invoices/:id/edit",
                                meta: {
                                    parent: "Invoicing",
                                },
                                icon: <FileAddOutlined/>,
                            },
                            {
                                name: "simplified B2C",
                                list: "/simplifiedinvoices",
                                show: "/simplifiedinvoices/:id",
                                create: "/simplifiedinvoices/new",
                                edit: "/simplifiedinvoices/:id/edit",
                                meta: {
                                    parent: "Invoicing",
                                    label: "Simplified B2C",
                                },
                                icon: <FileAddOutlined/>,
                            },
                            {
                                name: "standard B2B",
                                list: "/standardinvoices",
                                show: "/standardinvoices/:id",
                                create: "/standardinvoices/new",
                                edit: "/standardinvoices/:id/edit",
                                meta: {
                                    parent: "Invoicing",
                                    label: "Standard B2B",
                                },
                                icon: <FileAddOutlined/>,
                            },
                            {
                                name: "Appointments",
                                icon: <FieldTimeOutlined/>,
                                meta: {
                                    label: "Appointments",
                                },
                            },
                            {
                                name: "events",
                                list: "/events",
                                create: "/events/new",
                                edit: "/events/:id/edit",
                                meta: {
                                    parent: "Appointments",
                                },
                                icon: <FieldTimeOutlined/>,
                            },
                            {
                                name: "clientmedias",
                                list: "/clientmedias",
                                create: "/clientmedias/new",
                                edit: "/clientmedias/:id/edit",
                                meta: {
                                    parent: "Archive",
                                    label: "Client Archives"
                                },
                                icon: <TeamOutlined/>,
                            },
                        ]}
                        notificationProvider={useNotificationProvider}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                            breadcrumb: false,
                        }}
                    >
                        <Routes>
                            <Route
                                element={
                                    <Authenticated
                                        key="authenticated-routes"
                                        fallback={<CatchAllNavigate to="/login"/>}
                                    >
                                        <ThemedLayoutV2
                                            Header={() => <Header/>}
                                            Sider={(props) => <ThemedSiderV2 {...props} fixed/>}
                                            initialSiderCollapsed={false}
                                            Title={ThemedTitleV2}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: "1280px",
                                                    padding: "24px",
                                                    margin: "0 auto",
                                                }}
                                            >
                                                <Outlet/>
                                            </div>
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route index element={<DashboardPage/>}/>
                                <Route index element={<NavigateToResource/>}/>

                                <Route
                                    path="/accounts"
                                    element={
                                        <AccountsPageList>
                                            <Outlet/>
                                        </AccountsPageList>
                                    }
                                >
                                    <Route index element={null}/>
                                    <Route path="new" element={<AccountsPageCreate/>}/>
                                </Route>
                                <Route
                                    path="/accounts/:id/edit"
                                    element={<AccountsPageEdit/>}
                                />

                                <Route
                                    path="/accounts"
                                    element={
                                        <AccountsPageList>
                                            <Outlet/>
                                        </AccountsPageList>
                                    }
                                >
                                    <Route index element={null}/>
                                    <Route path="new" element={<AccountsPageCreate/>}/>
                                </Route>
                                <Route
                                    path="/accounts/:id/edit"
                                    element={<AccountsPageEdit/>}
                                />

                                <Route
                                    path="/clients"
                                    element={
                                        <ClientsPageList>
                                            <Outlet/>
                                        </ClientsPageList>
                                    }
                                >
                                    <Route index element={null}/>
                                    <Route path="new" element={<ClientsPageCreate/>}/>
                                </Route>
                                <Route path="/clients/:id/edit" element={<ClientsPageEdit/>}/>

                                <Route path="/invoices">
                                    <Route index element={<InvoicePageList/>}/>
                                    <Route path="new" element={<InvoicesPageCreate/>}/>
                                    <Route path=":id" element={<InvoicesPageShow/>}/>
                                    <Route path=":id/edit" element={<InvoicesPageEdit/>}/>
                                </Route>
                                <Route path="/simplifiedinvoices">
                                    <Route index element={<ListSimplifiedInvoices/>}/>
                                    <Route path="new" element={<SimplifiedInvoiceForm/>}/>
                                    <Route path=":id" element={<ShowSimplifiedInvoice/>}/>
                                    <Route path=":id/edit" element={<EditSimplifiedInvoice/>}/>
                                </Route><Route path="/standardinvoices">
                                    <Route index element={<ListStandardInvoices/>}/>
                                    <Route path="new" element={<StandardInvoiceForm/>}/>
                                    <Route path=":id" element={<ShowStandardInvoice/>}/>
                                    <Route path=":id/edit" element={<EditStandardInvoice/>}/>
                                </Route>

                                <Route
                                    path="/events"
                                    element={
                                        <EventsPageList>
                                            <Outlet/>
                                        </EventsPageList>
                                    }
                                >
                                    <Route index element={null}/>
                                    <Route path="new" element={<EventsPageCreate/>}/>
                                </Route>
                                <Route path="/events/:id/edit" element={<EventsPageEdit/>}/>

                                <Route
                                    path="/clientmedias"
                                    element={
                                        <ClientMediaPageList>
                                            <Outlet/>
                                        </ClientMediaPageList>
                                    }
                                >
                                    <Route index element={null}/>
                                    <Route path="new" element={<ClientMediaPageCreate/>}/>
                                </Route>
                                <Route path="/clients/:id/edit" element={<ClientMediaPageEdit/>}/>

                                <Route path="*" element={<ErrorComponent/>}/>
                            </Route>
                            <Route
                                element={
                                    <Authenticated key="auth-pages" fallback={<Outlet/>}>
                                        <NavigateToResource/>
                                    </Authenticated>
                                }
                            >
                                <Route path="/login" element={<Login/>}/>
                            </Route>

                            <Route
                                element={
                                    <Authenticated key="catch-all">
                                        <ThemedLayoutV2
                                            Header={() => <Header/>}
                                            Sider={() => <ThemedSiderV2 fixed/>}
                                        >
                                            <Outlet/>
                                        </ThemedLayoutV2>
                                    </Authenticated>
                                }
                            >
                                <Route path="*" element={<ErrorComponent/>}/>
                            </Route>
                        </Routes>
                        <UnsavedChangesNotifier/>
                        <DocumentTitleHandler/>
                    </Refine>
                </AntdApp>
            </ConfigProvider>
        </BrowserRouter>
    );
};

export default App;
