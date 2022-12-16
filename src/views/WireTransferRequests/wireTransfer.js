import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Table, OverlayTrigger, Tooltip, Form, Modal } from "react-bootstrap";
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import { ENV } from '../../config/config';
import { getWireRequests, beforeWireRequest } from './wireTransfer.action';
import Select from 'react-select'

const statusList = [
    { value: 1, label: 'Pending' },
    // { value: 2, label: 'Accepted' },
    { value: 3, label: 'Rejected' },
]

const WireTransferRequests = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [requestModal, setRequestModal] = useState(false)
    const [requestData, setRequestData] = useState()
    const [resetButton, setResetButton] = useState(false)
    const [loader, setLoader] = useState(true)
    const [filters, setFilters] = useState({
        firstName: '',
        lastName: '',
        status: ''
    })

    useEffect(() => {
        window.scroll(0, 0)
        props.getWireRequests()
    }, [])

    useEffect(() => {
        if (props.wireRequest.getWireRequestAuth) {
            const { wireRequests } = props.wireRequest.getWireRequestsList
            setData(wireRequests)
            // setPagination(props.request.getRequestPagesRes.pagination)
            setLoader(false)
            props.beforeWireRequest()
        }
    }, [props.wireRequest.getWireRequestAuth])

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.getRequest(qs)
    }

    const applyFilters = () => {
        if (filters && filters.firstName || filters.lastName || filters.status) {
            setResetButton(true)
            let payload = {}
            if (filters.firstName) {
                payload["firstName"] = filters.firstName
            }
            if (filters.lastName) {
                payload["lastName"] = filters.lastName
            }
            if (filters.status) {
                payload["status"] = filters.status.value
            }
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...payload })
            props.getRequest(qs)
            setLoader(true)
        }
        else {
            toast.error('Fill atleast one field.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const reset = () => {
        setResetButton(false)
        setFilters({ firstName: "", lastName: "", status: "" })
        props.getRequest()
        setLoader(true)
    }

    const manageRequest = (type, _id) => {
        setLoader(true)
        props.boforeManageRequest()
        let body = { action: type, _id }
        props.manageRequest(body)
    }

    const viewRequest = (detail) => {
        setRequestModal(true)
        setRequestData(detail)
    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-flex align-items-center justify-content-between table-head">
                                            <Card.Title as="h4">Wire Transfer Requests</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy table-w cms-table staff-table">
                                                <thead>
                                                    <tr>
                                                        <th className="td-start serial-col">#</th>
                                                        <th className="td-name">
                                                            <div className='faqs-title td-name'>Username</div>
                                                        </th>
                                                        <th className='td-status td-email'>Email</th>
                                                        <th className='td-status text-center'>Deposited Amount</th>
                                                        <th className='td-status text-center'>Receipt</th>
                                                        <th className="td-actions text-center">View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="serial-col text-white">{index + 1}</td>
                                                                        <td className="text-white">
                                                                            <div className="faq-title td-name">
                                                                                {item.userName}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-white td-email">
                                                                            {item.userEmail || 'N/A'}
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            {item.depositedAmount || 'N/A'}
                                                                        </td>
                                                                        <td className="text-white text-center">
                                                                            <div className="receipt-image-holder">
                                                                                <img className="img-fluid" src={item.image}/>
                                                                            </div>
                                                                        </td>
                                                                            <td className="td-actions text-center">
                                                                                <ul className="list-unstyled mb-0 d-flex justify-content-center">
                                                                                    <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-436082023"> View </Tooltip>} placement="left" >
                                                                                            <Button
                                                                                                className="btn-link btn-icon"
                                                                                                type="button"
                                                                                                variant="info"
                                                                                                onClick={() => {
                                                                                                    setLoader(true);
                                                                                                    props.history.push(`/request/${window.btoa(item._id)}`);
                                                                                                }}
                                                                                            >
                                                                                                <i className="fas fa-eye"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                    </li>
                                                                                </ul>
                                                                            </td> 
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="6" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Wire Requests Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                pagination &&
                                                <Pagination
                                                    className="m-3"
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={pagination.page} // current active page
                                                    total={pagination.pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        {requestModal &&
                            <Modal className="modal-primary edit-cotnact-modal" onHide={() => setRequestModal(!requestModal)} show={requestModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                Request Details
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className=" name-email">
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Name:</strong>
                                                    <span className='text-white'>{data?.userName}  </span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Email:</strong>
                                                    <span className='text-white'>{requestData?.email}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Request Type:</strong>
                                                    <span className='text-white'>  {requestData?.type == 1 ? "Deletion Request" : "N/A"}</span>
                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex align-items-center">
                                                    <strong className="mr-2 text-white">Status:</strong>

                                                    <span className={`text-white ml-2 badge ${requestData?.status === '3' ? `badge-danger p-1` : requestData?.status === '1' ? `badge-warning p-1` : requestData?.status === '2' ? `badge-success p-1` : ``}`}>
                                                        {
                                                            requestData?.status === '1' ? 'Pending' : requestData?.status === '2 ' ? 'Accepted' : requestData?.status === '3' ? 'Rejected' : 'N/A'

                                                        } </span>




                                                </div>
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2 text-white">Message:</strong>
                                                    <span className='text-white'>{requestData?.description}</span>
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>

                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    request: state.request,
    error: state.error,
    wireRequest: state.wireRequest
});

export default connect(mapStateToProps, { getWireRequests, beforeWireRequest })(WireTransferRequests);