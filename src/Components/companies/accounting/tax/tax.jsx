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

function BankAccount(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [tax, setTaxes] = useState([]);
  const [totalTaxLength, setTotalTaxLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newTax, setNewTax] = useState({
    client_id: clientID,
    company_id: companyID,
    name: "",
    details: "",
    value: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    console.log("tax page");
    // get contacts
    const getTaxes = async () => {
      const url = `${base_url}/admin/company/accounting/taxes/${companyID}`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Company Name", "Name"]);
          setTaxes(res.data.data);
          setTotalTaxLength(res.data.meta?.total);
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
    getTaxes();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newTax,
      [e.target.name]: e.target.value,
    };
    setNewTax(newData);

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
        `${base_url}/admin/company/accounting/taxes/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setTaxes(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/tax/${id}`,
        config
      );
      const newRow = tax.filter((item) => item.id !== id);
      setTaxes(newRow); // setRow(filterItems);
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

  const handleSubmitAddTax = async () => {
    await axios
      .post(`${base_url}/admin/company/accounting/tax`, newTax)
      .then((res) => {
        Toastify({
          text: `tax created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        tax.unshift(res.data.data);
        setNewTax({
          client_id: clientID,
          company_id: companyID,
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
      `${base_url}/admin/company/accounting/tax/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/accounting/tax/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      details: editItem.details,
      value: editItem.value,
    };
    await axios
      .patch(`${base_url}/admin/company/accounting/tax/${id}`, data)
      .then((res) => {
        Toastify({
          text: `tax updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < tax.length; i++) {
          if (tax[i].id === id) {
            tax[i] = res.data.data;
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
        <div className="tax">
          {/* header */}
          <h1 className="header">{t("Tax")}</h1>
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
          {tax.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalTaxLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {tax?.map((item, i) => (
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
            <NoData data="Tax" />
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
            newTax={newTax}
            handleChange={handleChange}
            handleSubmitAddTax={handleSubmitAddTax}
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

export default BankAccount;
