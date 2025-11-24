import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// --- Helper ---
const handleApiResponse = async (response) => {
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "An error occurred");
  return result;
};

// Helper to prepare request options for fetch, handling file uploads
const prepareRequestOptions = (method, body) => {
  let headers = {};
  let requestBody;

  // Check if the body contains a File object (e.g., for receiptImage)
  const hasFile = Object.values(body).some(
    (value) =>
      value instanceof File ||
      (Array.isArray(value) && value[0] instanceof File)
  );

  if (hasFile) {
    const formData = new FormData();
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        // If the value is a File object, append it directly
        if (body[key] instanceof File) {
          formData.append(key, body[key]);
        } else if (Array.isArray(body[key]) && body[key][0] instanceof File) {
          // If it's an array of files (though receiptImage is single)
          body[key].forEach((file) => formData.append(key, file));
        } else {
          formData.append(key, body[key]);
        }
      }
    }
    requestBody = formData;
    // Do NOT set Content-Type header for FormData, browser sets it automatically with boundary
  } else {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  return {
    method,
    headers,
    body: requestBody,
    credentials: "include",
  };
};

// ====================== AUTH ======================

// --- Register User ---
export const registerUser = createAsyncThunk(
  "resources/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const { data, success, message } = await handleApiResponse(res);

      // 👇 save login user data after register
      if (success) {
        localStorage.setItem("user", JSON.stringify(data));
      }

      return { data, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCommitteeMember = createAsyncThunk(
  "resources/createCommitteeMember",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const { data, success, message } = await handleApiResponse(res);

      return { data, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Login ---
export const login = createAsyncThunk(
  "resources/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const { data, success, message } = await handleApiResponse(res);

      if (success) {
        localStorage.setItem("user", JSON.stringify(data));
      }

      return { data, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Logout ---
export const logout = createAsyncThunk("resources/logout", async () => {
  localStorage.removeItem("user");
});

// ====================== GENERIC CRUD ======================

// --- Fetch Resource ---
export const fetchResources = createAsyncThunk(
  "resources/fetch",
  async ({ resource }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${resource}`, {
        credentials: "include",
      });
      const { data, success, message } = await handleApiResponse(res);
      return { resource, data, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// fetch By Id
export const fetchResourceById = createAsyncThunk(
  "resources/fetchById",
  async ({ resource, id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${resource}/${id}`, {
        credentials: "include",
      });
      const { data, success, message } = await handleApiResponse(res);
      return { resource, data, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Create Resource ---
export const createResource = createAsyncThunk(
  "resources/create",
  async ({ resource, body }, { rejectWithValue }) => {
    try {
      const options = prepareRequestOptions("POST", body);
      const res = await fetch(`${API_URL}/${resource}`, options);
      const { data, success, message } = await handleApiResponse(res);
      return { resource, data, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Update Resource ---
export const updateResource = createAsyncThunk(
  "resources/update",
  async ({ resource, id, body }, { rejectWithValue }) => {
    try {
      const options = prepareRequestOptions("PUT", body);
      const res = await fetch(`${API_URL}/${resource}/${id}`, options);
      const { data, success, message } = await handleApiResponse(res);
      return { resource, id, data, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Delete Resource ---
export const deleteResource = createAsyncThunk(
  "resources/delete",
  async ({ resource, id }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/api/${resource}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const { success, message } = await handleApiResponse(res);
      return { resource, id, success, message };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ====================== SCHOLARSHIP SHORTCUTS ======================

export const createScholarship = (formData) =>
  createResource({ resource: "scholarships", body: formData });

export const deleteScholarship = (id) =>
  deleteResource({ resource: "scholarships", id });

// ============================== applications shortcuts ==============================
export const createApplication = (formData) =>
  createResource({ resource: "applications/apply", body: formData });

export const updateApplication = (id, formData) =>
  updateResource({ resource: "applications", id, body: formData });

export const deleteApplications = (id) =>
  deleteResource({ resource: "applications", id });

export const fetchApplicationsById = (id) =>
  fetchResourceById({ resource: "applications", id });

//============================ evaluations shortcuts =============================
export const createEvaluation = (formData) =>
  createResource({ resource: "evaluations", body: formData });

export const fetchEvaluationsByCommitteeMember = (id) =>
  fetchResourceById({ resource: "evaluations", id });

// ====================== SLICE ======================

const storedUser = JSON.parse(localStorage.getItem("user") || "null");

const initialState = {
  user: storedUser,
  data: {},
  status: "idle",
  message: null,
  error: null,
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Register ---
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // create Committe Member
      .addCase(createCommitteeMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCommitteeMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload.message;
      })
      .addCase(createCommitteeMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Login ---
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.message = action.payload.message;
        state.status = "succeeded";
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })

      // --- Logout ---
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })
      // --- Fetch ---
      .addCase(fetchResources.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.data[action.payload.resource] = action.payload.data || [];
        state.status = "succeeded";
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Create ---
      .addCase(createResource.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createResource.fulfilled, (state, action) => {
        const { resource, data } = action.payload;
        if (!state.data[resource]) state.data[resource] = [];
        state.data[resource].push(data);
        state.status = "succeeded";
      })
      .addCase(createResource.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // --- Update ---
      .addCase(updateResource.fulfilled, (state, action) => {
        const { resource, id, data } = action.payload;

        // if resource is an array, update the specific item
        if (Array.isArray(state.data[resource])) {
          state.data[resource] = state.data[resource].map((item) =>
            item._id === id ? { ...item, ...data } : item
          );
        }
        // if resource is an object, merge the updates
        else if (
          state.data[resource] &&
          typeof state.data[resource] === "object"
        ) {
          state.data[resource] = { ...state.data[resource], ...data };
        }
        //  if resource does not exist, initialize it
        else {
          state.data[resource] = data;
        }
      })

      // --- Fetch by ID ---
      .addCase(fetchResourceById.pending, (state) => {
        state.status = "loading";
        state.error = null; // optional
      })
      .addCase(fetchResourceById.fulfilled, (state, action) => {
        const { resource, data } = action.payload;
        state.data[`${resource}ById`] = data;
        state.status = "succeeded";
      })
      .addCase(fetchResourceById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })

      // --- Delete ---
      .addCase(deleteResource.fulfilled, (state, action) => {
        const { resource, id } = action.payload;
        state.data[resource] = state.data[resource].filter(
          (item) => item._id !== id
        );
      });
  },
});

export default resourcesSlice.reducer;
