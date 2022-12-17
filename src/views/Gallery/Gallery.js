import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'
import { Button, Card, Col, Container, Form, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { beforeRole, getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { ENV } from '../../config/config';
import { beforeFaq, deleteFaq, getFaqs } from './Faq.action';
var CryptoJS = require("crypto-js");

const Gallery = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [loader, setLoader] = useState(true)
    const [resetButton, setResetButton] = useState(false)
    const [searchTitle, setSearchTitle] = useState('')
    const [searchStatus, setSearchStatus] = useState('')
    const [filters, setFilters] = useState({
        title: '',
        status: ''
    })

    const [permissions, setPermissions] = useState({})

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })
        props.getFaqs()
        let roleEncrypted = localStorage.getItem('role');
        let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
            role = roleDecrypted
            props.getRole(role)
        }
    }, [])

    useEffect(() => {
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
            props.beforeRole()
        }
    }, [props.getRoleRes])

    useEffect(() => {
        if (props.faqs.getFaqsAuth) {
            let { faqs, pagination } = props.faqs.faqs
            setData(faqs)
            setPagination(pagination)
            props.beforeFaq()
        }
    }, [props.faqs.getFaqsAuth])

    useEffect(() => {
        if (data) {
            setLoader(false)
        }
    }, [data])

    useEffect(() => {
        if (props.faqs.delFaqAuth) {
            let filtered = data.filter((item) => {
                if (item._id !== props.faqs.faq.faqId)
                    return item
            })
            setData(filtered)
            props.beforeFaq()
        }
    }, [props.faqs.delFaqAuth])

    const deleteFAQ = (faqId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete an item, it will lost permanently.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteFaq(faqId)
            }
        })
    }

    const onPageChange = async (page) => {
        setLoader(true)
        const qs = ENV.objectToQueryString({ page, ...filters })
        props.getFaqs(qs)
    }

    const applyFilters = () => {
        if ((filters && filters.title) || (filters && filters.status)) {
            setResetButton(true)
            const qs = ENV.objectToQueryString({ page: 1, limit: 10, ...filters })
            props.getFaqs(qs)
            setLoader(true)
        }
        else {
            toast.error('All filter fields are empty.', {
                toastId: "FIELD_REQUIRED",
            })
        }
    }

    const reset = () => {
        setResetButton(false)
        setFilters({ title: '' })
        props.getFaqs()
        setLoader(true)
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
                                            <Card.Title as="h4">Gallery</Card.Title>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">Thumbnail Image</Form.Label>
                                                    <div className="input-file-holder position-relative mb-3">
                                                        <input type="file" />
                                                        <span className="icon-upload">
                                                            <i className="nc-icon nc-cloud-upload-94"></i>
                                                        </span>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">High Resolution Image</Form.Label>
                                                    <div className="input-file-holder position-relative mb-3">
                                                        <input type="file" />
                                                        <span className="icon-upload">
                                                            <i className="nc-icon nc-cloud-upload-94"></i>
                                                        </span>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col sm={12}>
                                                <Form.Group>
                                                    <Button className="outline-button">Add Gallery Image</Button>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Row className="float-right">
                                            <Col sm={12}>
                                                <Button className="btn-filled">Save</Button>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    faqs: state.faqs,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeFaq, getFaqs, deleteFaq, getRole, beforeRole })(Gallery);