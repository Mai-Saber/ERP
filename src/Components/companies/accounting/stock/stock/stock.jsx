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

function Stock(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [stock, setStock] = useState([]);
  const [totalStocksLength, setTotalStocksLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newStock, setNewStock] = useState({
    client_id: clientID,
    company_id: companyID,
    warehouse_id: "",
    branch_id: "",
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
    console.log("Stocks page");
    // get getStocks
    const getStocks = async () => {
      const url = `${base_url}/admin/company/accounting/stock-management/stocking-request/${companyID}`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Company Name", "Name"]);
          setStock(res.data.data);
          setTotalStocksLength(res.data.meta?.total);
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
    getStocks();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newStock,
      [e.target.name]: e.target.value,
    };
    setNewStock(newData);

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
        `${base_url}/admin/company/accounting/stock-management/stocking-requests/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setStock(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/stock-management/stocking-request/${id}`,
        config
      );
      const newRow = stock.filter((item) => item.id !== id);
      setStock(newRow); // setRow(filterItems);
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
      client_id: newStock.clientID,
      company_id: newStock.companyID,
      branch_id: newStock.branch_id,
      warehouse_id:newStock.warehouse_id,
      name: newStock.name,
      details: newStock.details,
      final_products: [
        {
          category_id: newStock.category_id,
          product_id: newStock.product_id,
          final_product_id: newStock.final_product_id,
          measurement_unit_id: newStock.measurement_unit_id,
          unit_price: newStock.unit_price,
          count: newStock.count,
        },
      ],
    };

    await axios
      .post(`${base_url}/admin/company/accounting/stock-management/stocking-request`, data)
      .then((res) => {
        Toastify({
          text: `stock created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        stock.unshift(res.data.data);
        setNewStock({
          client_id: clientID,
          company_id: companyID,
          warehouse_id: "",
          branch_id: "",
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
      `${base_url}/admin/company/accounting/stock-management/stocking-request/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/accounting/stock-management/stocking-request/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      details: editItem.details,
    };
    await axios
      .patch(`${base_url}/admin/company/accounting/stock-management/stocking-request/${id}`, data)
      .then((res) => {
        Toastify({
          text: `stock updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < stock.length; i++) {
          if (stock[i].id === id) {
            stock[i] = res.data.data;
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
        <div className="stock">
          {/* header */}
          <h1 className="header">{t("stock")}</h1>
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
          {stock.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalStocksLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {stock?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>

                  <td className="name">{item.company?.name}</td>
                  <td>{item.name}</td>
                  <td>{item.details}</td>

                  {/* buttons */}
                  {/* stockFinalProduct  */}
                  <td>
                    <Link
                      to="/companies/refund/stockFinalProduct"
                      className="btn btn-primary"
                      onClick={() =>
                        props.handleStockFinalProduct(
                          item?.id,
                          item?.client_id,
                          item?.company_id
                        )
                      }
                    >
                      {t("stockFinalProduct")}
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
            <NoData data="stocks" />
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
            newStock={newStock}
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

export default Stock;
