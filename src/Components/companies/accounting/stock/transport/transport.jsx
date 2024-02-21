import React, { useState, useEffect } from "react";

import Table from "../../../../../common/table/table";
import TableFilter from "../../../../../common/tableFilter/tableFilter";
import "../../../../../common/show modal/showModal.css";
import Loading from "../../../../../common/loading/loading";
import TableIcons from "../../../../../common/tableIcons/tableIcons";
import NoData from "../../../../../common/noData/noData";
import WrongMessage from "../../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";
import { Link } from "react-router-dom";

function Transport(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [transports, setTransports] = useState([]);
  const [totalTransportsLength, setTotalTransportsLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newTransport, setNewTransport] = useState({
    client_id: clientID,
    company_id: companyID,
    from_warehouse_id: "",
    to_warehouse_id: "",
    name: "",
    details: "",

    category_id: "",
    product_id: "",
    final_product_id: "",
    measurement_unit_id: "",
    unit_price: "",
    count: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    console.log("transport page");
    // get
    const getTransport = async () => {
      const url = `${base_url}/admin/company/accounting/stock-management/transport-requests/${companyID}`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Company Name", "Name"]);
          setTransports(res.data.data);
          setTotalTransportsLength(res.data.meta?.total);
        })
        .catch((err) => {
          console.log("err", err);
          // loading
          setTimeout(function () {
            setLoading(false);
          }, 3000);

          setWrongMessage(true);
        });
    };
    // call functions
    getTransport();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newTransport,
      [e.target.name]: e.target.value,
    };
    setNewTransport(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // search & filter & pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchRequestControls, setSearchRequestControls] = useState({
    queryString: "",
    filterType: "",
    pageNumber: "",
    perPage: "",
  });

  const onPageChange = (e) => {
    setRowsPerPage(e.rows);
    setPageNumber(e.page + 1);

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
        `${base_url}/admin/company/accounting/stock-management/transport-requests/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setTransports(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/stock-management/transport-request/${id}`,
        config
      );
      const newRow = transports.filter((item) => item.id !== id);
      setTransports(newRow); // setRow(filterItems);
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
  const handleAdd = () => {
    setAddModal(true);
  };

  const handleSubmitAdd = async () => {
    const data = {
      client_id: newTransport.clientID,
      company_id: newTransport.companyID,
     from_warehouse_id:newTransport.from_warehouse_id,
     to_warehouse_id:newTransport.to_warehouse_id,
      name: newTransport.name,
      details: newTransport.details,
      final_products: [
        {
          category_id: newTransport.category_id,
          product_id: newTransport.product_id,
          final_product_id: newTransport.final_product_id,
          measurement_unit_id: newTransport.measurement_unit_id,
          unit_price: newTransport.unit_price,
          count: newTransport.count,
        },
      ],
    };

    await axios
      .post(`${base_url}/admin/company/accounting/stock-management/transport-request`, data)
      .then((res) => {
        Toastify({
          text: `transport created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        transports.unshift(res.data.data);
        setNewTransport({
          client_id: clientID,
          company_id: companyID,
          from_warehouse_id: "",
          to_warehouse_id: "",
          name: "",
          details: "",

          category_id: "",
          product_id: "",
          final_product_id: "",
          measurement_unit_id: "",
          unit_price: "",
          count: "",
        });
        setAddModal(false);
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
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
    setShowModal(true);
    const res = await axios.get(
      `${base_url}/admin/company/accounting/stock-management/transport-request/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/accounting/stock-management/transport-request/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      details: editItem.details,
      from_warehouse_id: editItem.from_warehouse_id,
      to_warehouse_id: editItem.to_warehouse_id,
    };
    await axios
      .patch(`${base_url}/admin/company/accounting/stock-management/transport-request/${id}`, data)
      .then((res) => {
        Toastify({
          text: `transport updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < transports.length; i++) {
          if (transports[i].id === id) {
            transports[i] = res.data.data;
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
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* branches */}
      {!loading && !wrongMessage && (
        <div className="transport">
          {/* header */}
          <h1 className="header">{t("Transport")}</h1>
          {/* upper table */}
          <TableFilter
            handleAdd={handleAdd}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />
          {/* table */}
          {transports.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalTransportsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {transports?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>

                  <td className="name">{item.company?.name}</td>
                  <td>{item.name}</td>
                  <td>{item.details}</td>

                  {/* buttons */}
                  {/* transportFinalProduct  */}
                  <td>
                    <Link
                      to="/companies/refund/transportFinalProduct"
                      className="btn btn-primary"
                      onClick={() =>
                        props.handleTransportFinalProduct(
                          item?.id,
                          item?.client_id,
                          item?.company_id
                        )
                      }
                    >
                      {t("TransportFinalProduct")}
                    </Link>
                  </td>

                  {/* icons */}
                  <TableIcons
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleShow={handleShow}
                  />
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="transport Final Product" />
          )}
          {/* modals */}
          {/* show modal */}
          <ModalShow
            show={showModal}
            handleClose={handleClose}
            item={selectedItem}
          />
          {/* add modal */}
          <ModalAdd
            show={addModal}
            handleClose={handleClose}
            newTransport={newTransport}
            companyID={companyID}
            handleChange={handleChange}
            handleSubmitAdd={handleSubmitAdd}
          />
          {/* edit modal */}
          <ModalEdit
            show={editModal}
            handleClose={handleClose}
            editItem={editItem}
            handleChange={handleChange}
            handleSubmitEdit={handleSubmitEdit}
          />
        </div>
      )}
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default Transport;
