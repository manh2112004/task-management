const Task = require("../model/task.model");
const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/searchName");
//[GET] //api/v1/tasks
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  let objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  const sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  //   pagination
  let initPagination = {
    currentPage: 1,
    limitItem: 6,
  };
  const countTask = await Task.countDocuments(find);
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTask
  );
  // end pagination
  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
  res.json(tasks);
};
//[GET] //api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(task);
  } catch (error) {
    res.json("ko tìm thấy");
  }
};
//[PATCH] //api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    await Task.updateOne({
      _id: id,
      status: status,
    });
    res.json({
      code: 200,
      message: "cập nhật trạng thái thành công",
    });
  } catch (error) {}
  res.json({
    code: 400,
    message: "không tồn tại",
  });
};
//[PATCH] //api/v1/tasks/change-Multi
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    console.log(ids);
    console.log(key);
    console.log(value);
    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công",
        });
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedAt: new Date(),
          }
        );
        res.json({
          code: 200,
          message: "xoá thành công",
        });
        break;
      default:
        break;
    }
  } catch (error) {}
  res.json({
    code: 400,
    message: "không tồn tại",
  });
};
//[POST] //api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    const task = new Task(req.body);
    const data = await task.save();
    res.json({
      code: 200,
      message: "tạo thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "lỗi",
    });
  }
};
//[POST] //api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, req.body);
    res.json({
      code: 200,
      message: "cập nhật thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "lỗi",
    });
  }
};
//[POST] //api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      }
    );
    res.json({
      code: 200,
      message: "xoá thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "lỗi",
    });
  }
};
