import { Container, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";

import BodyTitles from "../components/BodyTitles";
import CommonTable from "../components/CommonTable";
import AddUser from "../modals/AddUser";
import { useUsers } from "../store/user_store";
import { deleteAdmin, getAdmins } from "../services/user_service";
import { useErrorContext } from "../store/error_store";
import { useLoading } from "../store/loading_store";
import ConfirmationDialog from "../components/ConfirmationDialog";

const Users = () => {
  const itemsPerPage = 5;
  //contexts
  const { state, userDispatch } = useUsers();
  const { setErrorFun } = useErrorContext();
  const { loadingDispatch } = useLoading();
  //use states
  const [currentPage, setCurrentPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [shouldDelete, setShouldDelete] = useState(false);
  //helper functions
  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const openCreateModla = () => {
    setCreateModalOpen(true);
  };
  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };
  const handleDelete = () => {
    setShouldDelete(!shouldDelete);
  };

  const deleteUser = async () => {
    try {
      const uid = localStorage.getItem("selected_value");
      await deleteAdmin();
      userDispatch({
        type: "DELETE_USER",
        payload: {
          id: uid,
        },
      });
    } catch (error) {
      setErrorFun(`${error}`);
    }
    handleDelete();
  };
  useEffect(() => {
    loadingDispatch({
      type: "SET_LOADING",
    });

    getAdmins()
      .then((res) => {
        userDispatch({
          type: "GET_USERS",
          payload: {
            users: res,
          },
        });
      })
      .catch((err) => {
        setErrorFun(`${err}`);
      });

    loadingDispatch({
      type: "SET_NOT_LOADING",
    });
  }, []);

  return (
    <>
      <Container className="nav-bar-container">
        <BodyTitles
          title={"Users"}
          onClick={() => {
            openCreateModla();
          }}
        />
        <div className="body-body">
          <CommonTable
            data={state.users}
            headers={["role", "email", "name"]}
            primary_field_name="email"
            deleteFunc={handleDelete}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
            primaryFieldName={"email"}
          />
        </div>
        <Pagination
          count={Math.ceil(state.users.length / itemsPerPage)}
          page={currentPage}
          onChange={(event, newPage) => onPageChange(newPage)}
        />
      </Container>
      <AddUser open={createModalOpen} handleClose={closeCreateModal} />
      <ConfirmationDialog
        open={shouldDelete}
        onClose={handleDelete}
        onConfirm={deleteUser}
        message={"Do you want to delete this user ?"}
      />
    </>
  );
};

export default Users;
