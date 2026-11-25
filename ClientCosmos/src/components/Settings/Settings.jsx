import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Pencil, UserCircle, X } from "lucide-react";
import useUserData from "../utils/UserData";
import { API_URL } from "../../config";
import SiteLayout from "../layout/SiteLayout";
import ConfirmDialog from "../ui/ConfirmDialog";
import Sheet from "../Chats/Sheet";
import PageHeader from "../ui/PageHeader";

function Help() {
  return (
    <section className="d-card p-6">
      <h2 className="text-2xl font-bold">COSMOS Help Center</h2>
      <p className="mt-3 text-gray-300">
        Welcome to the COSMOS Help Center. Explore space-related topics, chat
        through communities, and share pictures you&apos;ve taken. For any assistance
        or inquiries, please reach out to us.
      </p>

      <h3 className="mt-6 text-lg font-semibold">Contact information</h3>
      <dl className="mt-3 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-gray-500">CREATOR</dt>
          <dd>MUHAMMED MUSTHAFA CP</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-500">EMAIL</dt>
          <dd>
            <a href="mailto:musthafacp0007@gmail.com" className="text-sky-300 hover:text-sky-200">
              musthafacp0007@gmail.com
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Banner({ kind, children }) {
  const style =
    kind === "error" ? "bg-red-500/10 text-red-300 border-red-500/30" : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`mb-4 rounded-lg border px-4 py-2.5 text-sm font-medium ${style}`}>
      {children}
    </div>
  );
}

function Account({ userData, setDeleteAccountPopUp, GoogleAuth }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPassword("");
    setNewPassword("");
    setFieldError("");
  };

  const flash = (setter, text) => {
    setter(text);
    setTimeout(() => setter(""), 4000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (currentPassword === "" || newPassword === "") {
      setFieldError("Please fill in both password fields.");
      return;
    }
    if (currentPassword === newPassword) {
      setFieldError("The new password must be different from the current one.");
      return;
    }
    setFieldError("");
    setSaving(true);
    try {
      const response = await axios.post(
        `${API_URL}/users/changepassword/${userData.user_id}`,
        { currentPassword, newPassword }
      );
      if (response.data.success) {
        setErrorMessage("");
        flash(setSuccessMessage, "Password changed successfully");
      } else {
        flash(setErrorMessage, "Current password is incorrect");
      }
      resetForm();
    } catch (error) {
      console.log("Error while changing the password", error);
      flash(setErrorMessage, "An error occurred while changing the password.");
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <section className="d-card p-6">
        <h2 className="text-xl font-bold">Account details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="acc-name" className="mb-1 block text-sm font-medium text-gray-400">Name</label>
            <input id="acc-name" type="text" className="d-input" value={userData.name || ""} disabled readOnly />
          </div>
          <div>
            <label htmlFor="acc-email" className="mb-1 block text-sm font-medium text-gray-400">Email</label>
            <input id="acc-email" type="text" className="d-input" value={userData.email || ""} disabled readOnly />
          </div>
        </div>
      </section>

      {GoogleAuth && (
        <section className="d-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Change password</h2>
            <button
              type="button"
              onClick={() => (isEditing ? resetForm() : setIsEditing(true))}
              title={isEditing ? "Cancel editing" : "Edit password"}
              aria-label={isEditing ? "Cancel editing password" : "Edit password"}
              className="d-btn h-9 w-9 !p-0"
            >
              {isEditing ? <X className="h-4 w-4" aria-hidden="true" /> : <Pencil className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          <div className="mt-4">
            {errorMessage && <Banner kind="error">{errorMessage}</Banner>}
            {successMessage && <Banner kind="success">{successMessage}</Banner>}
          </div>
          <form onSubmit={handleChangePassword} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cur-pass" className="mb-1 block text-sm font-medium text-gray-400">Current password</label>
                <input
                  id="cur-pass"
                  type="password"
                  autoComplete="current-password"
                  className="d-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="new-pass" className="mb-1 block text-sm font-medium text-gray-400">New password</label>
                <input
                  id="new-pass"
                  type="password"
                  autoComplete="new-password"
                  className="d-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {fieldError && <p role="alert" className="mt-2 text-xs text-red-400">{fieldError}</p>}
            {isEditing && (
              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={saving} className="d-btn-primary">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={resetForm} className="d-btn">
                  Cancel
                </button>
              </div>
            )}
          </form>
        </section>
      )}

      <section className="d-card !border-red-500/30 p-6">
        <h2 className="text-xl font-bold text-red-300">Delete account</h2>
        <p className="mt-2 text-sm text-gray-400">
          Permanently remove your account and its data. This cannot be undone.
        </p>
        <button type="button" onClick={() => setDeleteAccountPopUp(true)} className="mt-4 inline-flex items-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
          Delete account
        </button>
      </section>
    </div>
  );
}

const TABS = [
  { key: "Account", label: "Account", Icon: UserCircle },
  { key: "Help", label: "Help", Icon: HelpCircle },
];

function Settings() {
  const navigate = useNavigate();
  const [selectedFun, setSelectedFun] = useState("Account");
  const [DeleteAccountPopUp, setDeleteAccountPopUp] = useState(false);
  const [askPassWord, setAskPassWord] = useState(false);
  const [password, setPassWord] = useState("");
  const [GoogleAuth, setGoogleAuth] = useState(true);
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { userData, valid, loading } = useUserData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const googleAuth = Cookies.get("passwordisthere");
    if (googleAuth) {
      setGoogleAuth(false);
    }
  }, []);

  const DeleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/users/deleteMyAccount/${userData._id}`);
      Cookies.remove("token");
      Cookies.remove("passwordisthere");
      navigate("/HomePage");
      setDeleteAccountPopUp(false);
    } catch (err) {
      console.log("Error while deleting the Account", err);
      setPasswordInvalid("Could not delete the account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setAskPassWord(false);
    setDeleteAccountPopUp(false);
    setPassWord("");
    setPasswordInvalid("");
  };

  const AskPassword = () => {
    if (GoogleAuth) {
      setAskPassWord(true);
    } else {
      DeleteAccount();
    }
  };

  const CheckPassWord = async (e) => {
    if (e) e.preventDefault();
    if (password === "") {
      setPasswordInvalid("Please enter your password.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/users/checkPassword/${userData.user_id}`,
        { password }
      );
      if (response.data.message === "Password is correct") {
        DeleteAccount();
      } else {
        setPasswordInvalid(response.data.message);
      }
    } catch (err) {
      console.log("Error while checking Password", err);
      setPasswordInvalid("Could not verify your password. Please try again.");
    }
  };

  return (
    <SiteLayout valid={valid} userData={userData}>
      <PageHeader eyebrow="Account" title="Settings" description="Manage your account details, password and get help." />

      <div className="mt-8 flex flex-col gap-6 md:flex-row">
        <nav aria-label="Settings sections" className="flex shrink-0 gap-2 md:w-56 md:flex-col">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedFun(key)}
              aria-current={selectedFun === key ? "page" : undefined}
              className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 md:flex-none ${
                selectedFun === key
                  ? "bg-white text-black"
                  : "border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {selectedFun === "Account" && (
            <Account
              setDeleteAccountPopUp={setDeleteAccountPopUp}
              userData={userData}
              GoogleAuth={GoogleAuth}
            />
          )}
          {selectedFun === "Help" && <Help />}
        </div>
      </div>

      <ConfirmDialog
        open={!loading && !valid}
        title="Please log in to continue"
        message="You have to log in to see your account details."
        confirmLabel="Login"
        cancelLabel="Cancel"
        onConfirm={() => navigate("/login")}
        onCancel={() => navigate("/HomePage")}
      />

      <ConfirmDialog
        open={DeleteAccountPopUp && !askPassWord}
        danger
        title="Delete this account?"
        message="This action cannot be undone."
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onConfirm={AskPassword}
        onCancel={handleCancel}
      />

      <Sheet open={DeleteAccountPopUp && askPassWord} title="Confirm your password" onClose={handleCancel}>
        <form onSubmit={CheckPassWord} noValidate className="space-y-4">
          <p className="text-sm text-gray-400">Enter your password to permanently delete your account.</p>
          <div>
            <label htmlFor="del-pass" className="mb-1 block text-sm font-medium text-gray-400">Password</label>
            <input
              id="del-pass"
              type="password"
              autoComplete="current-password"
              autoFocus
              className="d-input"
              value={password}
              onChange={(e) => {
                setPassWord(e.target.value);
                setPasswordInvalid("");
              }}
            />
            {passwordInvalid && <p role="alert" className="mt-1 text-xs text-red-400">{passwordInvalid}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={handleCancel} className="d-btn">Cancel</button>
            <button type="submit" disabled={deleting} className="inline-flex items-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500">
              {deleting ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </form>
      </Sheet>
    </SiteLayout>
  );
}

export default Settings;
