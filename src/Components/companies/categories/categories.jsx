import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url, config } from "../../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import UpperTable from "../../../common/upperTable/upperTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../../common/loading/loading";
import "./categories.css";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import { Paginator } from "primereact/paginator";

function Categories(props) {
  const [categories, setCategories] = useState([]);
  const [totalRowLength, setTotalRowLength] = useState("");

  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState("");
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newCategory, setNewCategory] = useState({
    client_id: clientID,
    company_id: companyID,
    category_id: "",
    name: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);
    // call functions
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await axios.get(
        `${base_url}/admin/company/categories/${companyID}`
      );
      setCategories(res.data.data);
      setTotalRowLength(res.data.meta?.total);
    } catch (err) {
      console.log("errr", err);
    }
  };
  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newCategory,
      [e.target.name]: e.target.value,
    };
    setNewCategory(newData);

    console.log(editItem);
    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // search & filter
  // search & filter & pagination

  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);
  const [searchRequestControls, setSearchRequestControls] = useState({
    queryString: "",
    filterType: "",
    pageNumber: "",
    perPage: "",
  });

  const onPageChange = (e) => {
    setRows(e.rows);
    setPage(e.page + 1);

    handleSearchReq(e, {
      perPage: e.rows,
      pageNumber: e.page + 1,
    });
  };

  const handleSearchReq = async (
    e,
    { queryString, filterType, perPage, pageNumber }
  ) => {
    try {
      setSearchRequestControls({
        queryString: queryString,
        filterType: filterType,
        pageNumber: pageNumber,
        perPage: perPage,
      });

      const res = await axios.get(
        `${base_url}/admin/company/categories/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setCategories(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/company/category/${id}`, config);
      getCategories();
      Toastify({
        text: `${name} deleted `,
        style: {
          background: "green",
          color: "white",
        },
      }).showToast();
    } else {
      Toastify({
        text: `${name} haven't deleted `,
        style: {
          background: "orange",
          color: "white",
        },
      }).showToast();
    }
  };

  // add
  const handleAdd = (id) => {
    if (id) {
      newCategory.category_id = id;
    } else {
      newCategory.category_id = "";
    }
    newCategory.name = "";
    setNewCategory(newCategory);
    setAddModal(true);
  };

  const handleSubmitAddCategory = async () => {
    await axios
      .post(`${base_url}/admin/company/category`, newCategory)
      .then((res) => {
        if (!newCategory.category_id) {
          console.log(res.data.data);
          categories.unshift(res.data.data);
          Toastify({
            text: `Category created successfully `,
            style: {
              background: "green",
              color: "white",
            },
          }).showToast();
        }
        //child
        else {
          console.log("el");
          getCategories();
          // toast
          Toastify({
            text: `Sub Category created successfully `,
            style: {
              background: "green",
              color: "white",
            },
          }).showToast();
        }
        setNewCategory({
          client_id: clientID,
          company_id: companyID,
          category_id: "",
          name: "",
        });
        setAddModal(false);
      })
      .catch((err) => {
        console.log(err);
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // show
  const handleShow = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/category/${id}`,
      config
    );
    setItem(res.data.data);
    setShowModal(true);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/company/category/${id}`);
    setEditItem(res.data.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
    };
    console.log("data", data);
    await axios
      .patch(`${base_url}/admin/company/category/${id}`, data)
      .then((res) => {
        Toastify({
          text: `Category updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].data?.id === id) {
            categories[i] = res.data.data;
          } else {
            getCategories();
          }
        }
        setEditItem({});
        setEditModal(false);
      })
      .catch((err) => {
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // close any modal
  const handleClose = () => {
    setShowModal(false);
    setAddModal(false);
    setEditModal(false);
  };
  // ////////////////////////////////////////
  const actionTemplate = (item) => {
    return (
      <div className="flex flex-wrap gap-2 icons">
        {/* product */}

        <Link
          className="product"
          to=""
          // onClick={() => handleShow(item.data.id)}
        >
          <button className="btn btn-primary">Products </button>
        </Link>
        {/* add */}
        <Link className="add" to="" onClick={() => handleAdd(item.data.id)}>
          <i className="ri-add-circle-line"></i>
        </Link>
        {/* edit */}
        <Link className="edit" to="" onClick={() => handleEdit(item.data.id)}>
          <i className="ri-pencil-line"></i>
        </Link>
        {/* delete */}
        <Link
          className="delete"
          to=""
          onClick={() => handleDelete(item.data.id, item.data.name)}
        >
          <i className="ri-delete-bin-2-fill"></i>
        </Link>
        {/* show */}

        <Link className="show" to="" onClick={() => handleShow(item.data.id)}>
          <i className="ri-eye-line"></i>
        </Link>
      </div>
    );
  };

  // ///////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* Categories */}
      {!loading && (
        <div className="categories">
          {/* header */}
          <h1 className="header">{t("Categories")}</h1>
          {/* upper table */}
          <UpperTable
            handleAdd={handleAdd}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />
          {/*tree*/}
          <div className="card">
            <TreeTable
              className="table"
              value={categories}
              tableStyle={{ minWidth: "100%" }}
            >
              <Column field="name" header="Name" expander sortable></Column>
              <Column
                body={(item) => actionTemplate(item)}
                field="id"
                headerClassName="w-10rem"
              />
            </TreeTable>
          </div>

          {/* pagination */}
          <div className="card">
            <Paginator
              first={page}
              rows={rows}
              totalRecords={totalRowLength}
              rowsPerPageOptions={[3,5, 10, 20, 30]}
              onPageChange={onPageChange}
            />
          </div>

          {/* modals*/}
          {/* show modal */}
          <Modal className="showModal" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton className="header">
              <Modal.Title>{item.data?.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                <span className="label">{t("Name")} : </span>
                {item.data?.name}
              </p>
              <p>
                <span className="label">{t("Id")} : </span> {item.data?.id}
              </p>
              <p>
                <span className="label">{t("created_at")} : </span>
                {item.data?.created_at}
              </p>
              <p>
                <span className="label">Children Count :</span>
                {item.children?.length}
              </p>

              <hr />
              <h3>{t("CompanyDetails")}</h3>
              <p>
                <span className="label">{t("CompanyName")} : </span>
                {item.data?.company_id}
              </p>
              <p>
                <span className="label">{t("CompanyId")} : </span>
                {item.data?.company_id}
              </p>
              <p>
                <span className="label"> {t("ClientId")} : </span>
                {item.data?.client_id}
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                className="close btn btn-danger"
              >
                {t("Close")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* add modal */}
          <Modal show={addModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title> {t("AddNewCategory")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form action="post">
                <TextField
                  autoFocus
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Name")}
                  name="name"
                  value={newCategory.name}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Category_id")}
                  name="category_id"
                  value={newCategory.category_id}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("CompanyId")}
                  name="company_id"
                  value={newCategory.company_id}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("ClientId")}
                  name="client_id"
                  value={newCategory.client_id}
                  onChange={handleChange}
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="close btn btn-danger"
                variant="secondary"
                onClick={handleClose}
              >
                {t("Close")}
              </Button>
              <Button
                className="btn btn-primary"
                variant="primary"
                onClick={handleSubmitAddCategory}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* edit modal */}
          <Modal show={editModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title>{t("EditCategory")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form action="post">
                <TextField
                  autoFocus
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Name")}
                  name="name"
                  value={editItem.name}
                  onChange={handleChange}
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="close btn btn-danger"
                variant="secondary"
                onClick={handleClose}
              >
                {t("Close")}
              </Button>
              <Button
                className="btn btn-primary"
                variant="primary"
                onClick={() => handleSubmitEdit(editItem.id)}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default Categories;

