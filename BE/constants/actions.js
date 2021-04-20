
const QL_KHACHMOI = '607e9b98d6712a743874b55b';
const QL_CONGVIEC = '607e9bd7d6712a743874b55d';
const QL_KICHBAN = '607e9bc5d6712a743874b55c';
const QL_BANTOCHUC = '607eb16de3a97352eca20e50';
const QL_SUKIEN = '607ec1c3bb3ae404bc37fc24';


const QUANLY = '600bdb7a9cdca145ec3aac96';
const TRUONGBAN = '60449bb82e4f4b16302fdc2e';
const PHOBAN = '60449bbf2e4f4b16302fdc2f';
const ADMIN = '6062e97db8968748e0906a14';

const NHOM_TOANQUYEN = [ADMIN, QUANLY, TRUONGBAN, PHOBAN];
const QL_SUKIEN_PERMISSION = [...NHOM_TOANQUYEN, QL_SUKIEN];
const QL_BANTOCHUC_PERMISSION = [...NHOM_TOANQUYEN, QL_BANTOCHUC];
const QL_KHACHMOI_PERMISSION = [...NHOM_TOANQUYEN, QL_KHACHMOI];
const QL_KICHBAN_PERMISSION = [...NHOM_TOANQUYEN, QL_KICHBAN];
const QL_CONGVIEC_PERMISSION = [...NHOM_TOANQUYEN, QL_CONGVIEC];
module.exports = Object.freeze({
    QL_KHACHMOI,
    QL_CONGVIEC,
    QL_CONGVIEC,
    QL_KICHBAN,
    QL_BANTOCHUC,
    QL_SUKIEN,
    QUANLY,
    TRUONGBAN,
    PHOBAN,
    ADMIN,
    NHOM_TOANQUYEN,
    QL_SUKIEN_PERMISSION,
    QL_BANTOCHUC_PERMISSION,
    QL_KHACHMOI_PERMISSION,
    QL_KICHBAN_PERMISSION,
    QL_CONGVIEC_PERMISSION
});