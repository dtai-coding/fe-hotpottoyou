import axiosClient from './axiosClient';

const utensilApi = {
  getAll: (params) => {
    const url = '/v1/utensil';
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  // Nếu api có gửi body kèm theo image/images lúc create thì dùng api như này.
  createUtensilWithImg: (payload) => {
    const url = '/news';
    return axiosClient.post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // Nếu api chỉ có truyền mỗi body thì xài api này.
  createUtensil: (payload) => {
    const url = '/v1/utensil';
    return axiosClient.post(url, payload);
  },

  deleteUtensil: (payload) => {
    const url = `/v1/utensil?id=${payload}`;
    return axiosClient.delete(url);
  },

  updateUtensil: (payload) => {
    const url = `/v1/utensil/update`;
    return axiosClient.put(url, payload);
  },
};

export default utensilApi;

// ******** CÁCH SỬ DỤNG *********** /

// 1. Import tên file  vào component cần callAPI
// ví dụ: import utensilApi from "../../api/utensilAPI"

// 2. cách call api

// -------------Method: GET--------------

// const [dataUtensil, setDataUtensil] = useState([]);
// const [loading, setLoading] = useState(false);

// const fetchListUtensil = async () => {
//   try {
//     setLoading(true);
//     const response = await listUtensilApi.getAll({}); truyền vào bất cứ thứ gì mà api yêu cầu dạng params, VD: name(tên field BE yêu cầu): "abc", category: "category1"
//     console.log("dataTBL", response);
//     setDataUtensil(response.data);
//   } catch (error) {
//     console.log("err", error);
//     setDataUtensil([]);
//     if (error.response) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error("Load Data failed !");
//     }
//   } finally {
//     setLoading(false);
//   }
// };
// useEffect(() => {
//   fetchListUtensil();
// }, []);

// -------------Method: POST--------------

// const handleCreateUtensil = async (data) => {
//   try {
//     const response = await utensilApi.createUtensil(data);
//     console.log('Created utensil response:', response);
//   } catch (error) {
//     console.error('Error creating utensil:', error);
//     if (error.response) {
//       toast.error(error.response.data.message);
//     } else {
//       toast.error('Failed to create utensil !');
//     }
//   }
// };
// cuối cùng là gọi hàm "handleCreateUtensil" ở onClick = {() => handleCreateUtensil(values)} ( values là tên đạt tùy thích nó là giá trị được truyền về)

// -------------Method: DELETE--------------

// làm tương tự POST truyền về id từ url hoặc state

// -------------Method: PUT--------------

// làm tương tự POST truyền vào 1 object có nhưng thuộc tính như của bản gốc trước khi update
