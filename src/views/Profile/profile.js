import React, { useRef, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getRole, beforeRole } from "views/AdminStaff/permissions/permissions.actions";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { beforeAdmin, getAdmin, updateAdmin, updatePassword } from '../Admin/Admin.action';
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
var CryptoJS = require("crypto-js");
import { toast } from 'react-toastify';
import validator from 'validator';
import { ENV } from 'config/config';

const userDefaultImg = 'https://res.cloudinary.com/arhamsoft-ltd/image/upload/v1658297126/hex-nft/assets/default-profile_captlc.png';

function Profile(props) {
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    status: '',
    image: ''
  })

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
    _id: ''
  })

  const [pic, setPic] = useState({
    image: null,
    _id: ''
  })

  const [nameMsg, setNameMsg] = useState(false)
  const [emailMsg, setEmailMsg] = useState(false)
  const [phoneMsg, setPhoneMsg] = useState(false)
  const [passwordMsgCheck, setPasswordMsgCheck] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [adminRole, setAdminRole] = useState('')
  const [loader, setLoader] = useState(true)
  const adminId = localStorage.getItem('userID')

  useEffect(() => {
    window.scroll(0, 0)
    props.getAdmin(adminId)
    let roleEncrypted = localStorage.getItem('role');
    let role = ''
    if (roleEncrypted) {
      let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, ENV.secretKey).toString(CryptoJS.enc.Utf8);
      role = roleDecrypted
      props.getRole(role)
    }
  }, [])



  useEffect(() => {
    if (admin) {
      setLoader(false)
    }
  }, [admin])

  useEffect(() => {
    if (props.admin.getAuth) {
      const { admin } = props.admin
      setAdmin(admin)
    }
  }, [props.admin.getAuth])

  useEffect(() => {
    if (props.admin.updateAdminAuth) {
      setLoader(false)
      props.beforeAdmin()
    }
  }, [props.admin.updateAdminAuth])

  useEffect(() => {
    if (Object.keys(props.getRoleRes).length > 0) {
      setAdminRole(props.getRoleRes.role)
      // props.beforeRole()
    }
  }, [props.getRoleRes])

  useEffect(() => {
    if (password.new === password.confirm) {
      setPasswordMsgCheck(false)
    }
    else {
      setPasswordMsg('New passord & confirm password are not same.')
      setPasswordMsgCheck(true)
    }
  }, [password])


  const submitCallBack = (e) => {
    e.preventDefault()

    if (!validator.isEmpty(admin.name) && validator.isEmail(admin.email)) {
      if (validator.isEmpty(admin.phone)) {
        //Submit for empty phone field
        setNameMsg(false)
        setEmailMsg(false)
        setPhoneMsg(false)
        let formData = new FormData()
        for (const key in admin)
          formData.append(key, admin[key])
        props.updateAdmin(formData)
      }
      else {
        if (validator.isMobilePhone(admin.phone)) {
          //Submit 
          setNameMsg(false)
          setEmailMsg(false)
          setPhoneMsg(false)
          let formData = new FormData()
          for (const key in admin)
            formData.append(key, admin[key])
          props.updateAdmin(formData)
        }
        else {
          //Dont submit
          setPhoneMsg(true)
        }
      }
    }
    else {
      if (validator.isEmpty(admin.name)) {
        setNameMsg(true)
      }
      else {
        setNameMsg(false)
      }
      if (!validator.isEmail(admin.email)) {
        setEmailMsg(true)
      }
      else {
        setEmailMsg(false)
      }
      if (validator.isDecimal(admin.phone)) {
        setPhoneMsg(false)
      }
      else {
        setPhoneMsg(true)
      }

    }


  }

  const passwordForm = (e) => {
    e.preventDefault()

    if (!validator.isEmpty(password.current) && !validator.isEmpty(password.new)
      && !validator.isEmpty(password.confirm)
    ) {
      if (password.new === password.confirm) {
        if (validator.isStrongPassword(password.new)) {
          setPasswordMsgCheck(false)
          let formData = new FormData()
          for (const key in password)
            formData.append(key, password[key])
          props.updatePassword(formData)

          setPassword({
            current: '',
            new: '',
            confirm: '',
            _id: ''
          })
          e.target[0].value = ''
          e.target[1].value = ''
          e.target[2].value = ''

        }
        else {
          setPasswordMsg('Password must contain Upper Case, Lower Case, a Special Character, a Number and must be at least 8 characters in length')
          setPasswordMsgCheck(true)
        }
      }
      else {
        setPasswordMsg('New password & confirm password are not same.')
        setPasswordMsgCheck(true)
      }
    }
    else {
      setPasswordMsg('You have to fill all fields to change password.')
      setPasswordMsgCheck(true)
    }
  }

  const onFileChange = (e) => {
    let file = e.target.files[0]
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onloadend = function () {
        setAdmin({ ...admin, image: reader.result })
      }
      setPic({ _id: adminId, image: file })
      // setPic({ ...pic, image: file })
    }
  }

  const submitPic = (e) => {
    e.preventDefault()
    if (pic.image) {
      let formData = new FormData()
      for (const key in pic)
        formData.append(key, pic[key])

      props.updateAdmin(formData)
      setLoader(true)
      document.querySelector('#imageUploader').value = null
      setPic({ ...pic, image: null })
    }
    else {
      toast.error('Please upload pic before updating.')
    }

  }

  return (
    <>

      {
        loader ?
          <FullPageLoader />
          :
          <Container fluid>
            <div className="section-image" data-image="../../assets/img/bg5.jpg">
              {/* you can change the color of the filter page using: data-color="blue | purple | green | orange | red | rose " */}
              <Container>
                <Row>
                  <Col xl="8">
                    <Form action="" className="form" onSubmit={(e) => submitCallBack(e)}>
                      <Card className="pb-4 table-big-boy">
                        <Card.Header>
                          <Card.Header className="pl-0">
                            <Card.Title as="h4">Profile</Card.Title>
                          </Card.Header>
                        </Card.Header>
                        <Card.Body>

                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Name<span className="text-danger"> *</span></label>
                                <Form.Control
                                  value={admin?.name}
                                  onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                                  placeholder="Company"
                                  type="text"
                                ></Form.Control>
                                <span className={nameMsg ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">Name Required</label>
                                </span>

                              </Form.Group>
                            </Col>
                            <Col className="pl-3" md="6">
                              <Form.Group>
                                <label>Email<span className="text-danger"> *</span></label>
                                <Form.Control
                                  className="input-bg"
                                  value={admin?.email}
                                  placeholder="Email"
                                  type="email"
                                  disabled={true}
                                ></Form.Control>
                                <span className={emailMsg ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">Email Required</label>
                                </span>

                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md="12">
                              <Form.Group>
                                <label>Address</label>
                                <Form.Control
                                  value={admin?.address}
                                  onChange={(e) => setAdmin({ ...admin, address: e.target.value })}
                                  placeholder="Address"
                                  type="text"
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Col md="6">
                              <Form.Group>
                                <label>Phone</label>
                                <Form.Control
                                  value={admin?.phone}
                                  onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                                  type="text"
                                ></Form.Control>
                                <span className={phoneMsg ? `` : `d-none`}>
                                  <label className="pl-1 text-danger">Invalid Phone No</label>
                                </span>
                              </Form.Group>
                            </Col>
                            <Col md="6">
                              <Form.Group>
                                <label>Role</label>
                                <Form.Control
                                  className="input-bg"
                                  readOnly
                                  value={adminRole?.title}
                                  type="text"
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <div className="d-flex justify-content-end align-items-center">
                                <Button
                                  className="btn-filled pull-right"
                                  type="submit"
                                  variant="info"
                                >
                                  Update Profile
                                </Button>
                              </div>
                            </Col>
                          </Row>
                          <div className="clearfix"></div>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Col>
                  <Col xl="4">
                    <Card className="card-user table-big-boy">
                      {/* <Card.Header className="no-padding">
                        <div className="card-image">
                        </div>
                      </Card.Header> */}
                      <Card.Body>
                        <div className="author">
                          <img
                            alt="..."
                            className="avatar border-gray"
                            src={admin.image ? admin.image : userDefaultImg}
                          />
                          <Card.Title as="h5">{admin.name}</Card.Title>
                          <p className="card-description"></p>
                        </div>


                        <Form className="profile-main-form">
                          <Form.Group className="pl-3 pr-3">
                            <Form.Control
                              className="text-white"
                              placeholder="Company"
                              type="file"
                              varient="info"
                              accept=".png,.jpeg,.jpg"
                              onChange={(e) => onFileChange(e)}
                              id="imageUploader"
                            ></Form.Control>

                            <div className="text-center">
                              <Button
                                className="btn-filled pull-right mt-5"
                                type="button"
                                variant="info"
                                onClick={submitPic}
                              >
                                Update Pic
                              </Button>
                            </div>

                          </Form.Group>
                        </Form>

                      </Card.Body>
                      <Card.Footer>
                        <div className="pb-2"></div>
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12">
                    <Form action="" className="form" onSubmit={(e) => passwordForm(e)}>
                      <Card className="table-big-boy pb-4">
                        <Card.Header>
                          <Card.Header className="pl-0">
                            <Card.Title as="h4">Change Password</Card.Title>
                          </Card.Header>
                        </Card.Header>
                        <Card.Body>


                          <Row>
                            <Col md="4">
                              <Form.Group>
                                <label>Current Password<span className="text-danger"> *</span></label>
                                <Form.Control
                                  placeholder="Current Password"
                                  type="password"
                                  onChange={(e) => {
                                    setPassword({ ...password, current: e.target.value });
                                  }

                                  }
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <label>New Password<span className="text-danger"> *</span></label>
                                <Form.Control
                                  placeholder="New Password"
                                  type="password"
                                  onChange={(e) => {
                                    setPassword({ ...password, new: e.target.value });
                                  }
                                  }
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                            <Col md="4">
                              <Form.Group>
                                <label>Confirm Password<span className="text-danger"> *</span></label>
                                <Form.Control
                                  placeholder="Confirm Password"
                                  type="password"
                                  onChange={(e) => setPassword({ ...password, confirm: e.target.value, _id: adminId })}
                                ></Form.Control>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row>
                            <Form.Group className={passwordMsgCheck ? `` : `d-none`}>
                              <label className="pl-3 text-danger">{passwordMsg}</label>
                            </Form.Group>
                          </Row>
                          <Row>
                            <Col md={12}>
                              <div className="d-flex justify-content-end align-items-center">
                                <Button
                                  className="btn-filled pull-right"
                                  type="submit"
                                  variant="info"
                                >
                                  Update Password
                                </Button>
                              </div>
                            </Col>
                          </Row>
                          <div className="clearfix"></div>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </div>
          </Container>
      }


    </>
  );
}

const mapStateToProps = state => ({
  admin: state.admin,
  error: state.error,
  getRoleRes: state.role.getRoleRes,
});

export default connect(mapStateToProps, { beforeAdmin, getAdmin, updateAdmin, updatePassword, getRole, /* beforeRole */ })(Profile);
