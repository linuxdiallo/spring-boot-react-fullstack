import {useState, useEffect} from "react";
import {getAllStudens} from "./client";
import {deleteStudent} from "./client";
import {
    FileOutlined,
    PieChartOutlined,
    DesktopOutlined,
    TeamOutlined,
    LoadingOutlined, PlusOutlined, UserOutlined
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";
import {
    Avatar,
    Badge,
    Breadcrumb, Button, Divider, Empty, Image,
    Layout,
    Menu, Popconfirm, Radio, Spin,
    Table, Tag
} from 'antd';
import './App.css';
import {successNotification} from "./Notification";
import {errorNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim === 0) {
        return <Avatar size={64} icon={<UserOutlined/>}/>
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    // get the first letter of the name and the first letter of the second part of the split
    /*return <Avatar>{`${name.charAt(0)}${split[1].charAt(0)}`}</Avatar>*/
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>

}

const removeStudent = (studentId, callback) => {
    deleteStudent(studentId)
        .then(() => {
            successNotification("Student deleted", `Student with Id ${studentId} was deleted`)
            callback();
        }).catch(err => {
        err.response.json().then(res => {
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`,
                "bottomLeft");
        });
    });
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        key: 'action',
        render: (text, student) =>
            <Radio.Group>
                <Popconfirm
                    placement="topRight"
                    title={`Are you sure to delete ${student.name}`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText="Yes"
                    cancelText="No">
                    <Radio.Button value="small">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button value="small">Edit</Radio.Button>
            </Radio.Group>
    }
];

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);
    const fetchStudents = () => getAllStudens()
        .then(res => res.json())
        .then(data => {
            setStudents(data);
        }).catch(err => {
            err.response.json().then(res => {
                errorNotification("There was an issue",
                    `${res.message} [${res.status}] [${res.error}]`);
            });
        }).finally(() => {
            setFetching(false);
        })
    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary"
                    shape="round"
                    icon={<PlusOutlined/>}
                    size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() =>
                    <>
                        <Tag>Number of students</Tag>
                        <Badge count={students.length} className="site-badge-count-4"/>
                        <br/>
                        <br/>
                        <Button
                            onClick={() => setShowDrawer(!showDrawer)}
                            type="primary"
                            shape="round"
                            icon={<PlusOutlined/>}
                            size="small">
                            Add New Student
                        </Button>
                    </>
                }

                pagination={{pageSize: 50}}
                scroll={{y: 400}}
                rowKey={(student) => student.id}
            />
        </>
    }

    useEffect(() => {
        fetchStudents()
            .finally();
    }, []);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed}
                   onCollapse={setCollapsed}>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<PieChartOutlined/>}>
                        Option 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DesktopOutlined/>}>
                        Option 2
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Bill</Menu.Item>
                        <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" icon={<FileOutlined/>}>
                        Files
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}/>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Students</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        {renderStudents()}
                    </div>
                </Content>
               {/* <Footer style={{textAlign: 'center'}}>
                    <Image
                    width={75}
                    src="https://user-images.githubusercontent.com/46399723/231156020-696ffeb9-52cf-47ad-ac03-4c43547d0cfc.png"
                    />
                    <Divider>By amigoscode community &copy; 2023</Divider>
                </Footer>*/}
            </Layout>
        </Layout>
    );
}

export default App;
