import React, { useState, useEffect } from "react";

import Table from "../../../../common/table/table";
import TableFilter from "../../../../common/tableFilter/tableFilter";
import "../../../../common/show modal/showModal.css";
import Loading from "../../../../common/loading/loading";
import TableIcons from "../../../../common/tableIcons/tableIcons";
import NoData from "../../../../common/noData/noData";
import WrongMessage from "../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function CashBox(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [cashBox, setCashBox] = useState([]);
  const [totalCashBoxesLength, setTotalCashBoxesLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newCashBox, setNewCashBox] = useState({
    client_id: clientID,
    company_id: companyID,
    branch_id: "",
    name: "",
    details: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    console.log("cashBox page");
    // get contacts
    const getCahBox = async () => {
      const url = `${base_url}/admin/company/accounting/cash-boxes/${companyID}`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Company Name", "Name"]);
          setCashBox(res.data.data);
          setTotalCashBoxesLength(res.data.meta?.total);
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
    getCahBox();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newCashBox,
      [e.target.name]: e.target.value,
    };
    setNewCashBox(newData);

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
        `${base_url}/admin/company/accounting/cash-boxes/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setCashBox(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/cash-box/${id}`,
        config
      );
      const newRow = cashBox.filter((item) => item.id !== id);
      setCashBox(newRow); // setRow(filterItems);
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

  const handleSubmitAddCashBox = async () => {
    await axios
      .post(`${base_url}/admin/company/accounting/cash-box`, newCashBox)
      .then((res) => {
        Toastify({
          text: `box created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        cashBox.unshift(res.data.data);
        setNewCashBox({
          client_id: clientID,
          company_id: companyID,
          branch_id: "",
          name: "",
          details: "",
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
      `${base_url}/admin/company/accounting/cash-box/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/accounting/cash-box/${id}`
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
      .patch(`${base_url}/admin/company/accounting/cash-box/${id}`, data)
      .then((res) => {
        Toastify({
          text: `cash box updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < cashBox.length; i++) {
          if (cashBox[i].id === id) {
            cashBox[i] = res.data.data;
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
        <div className="cashBox">
          {/* header */}
          <h1 className="header">{t("CashBox")}</h1>
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
          {cashBox.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalCashBoxesLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {cashBox?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>

                  <td className="name">{item.company?.name}</td>
                  <td>{item.name}</td>
                  <td>{item.details}</td>

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
            <NoData data="Cash Box" />
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
            newCashBox={newCashBox}
            handleChange={handleChange}
            handleSubmitAddCashBox={handleSubmitAddCashBox}
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

export default CashBox;
