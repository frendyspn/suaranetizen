<?php

return [
    'accepted'             => ':Attribute harus diterima.',
    'accepted_if'          => ':Attribute harus diterima ketika :other berisi :value.',
    'active_url'           => ':Attribute bukan URL yang valid.',
    'after'                => ':Attribute harus berisi tanggal setelah :date.',
    'after_or_equal'       => ':Attribute harus berisi tanggal setelah atau sama dengan :date.',
    'alpha'                => ':Attribute hanya boleh berisi huruf.',
    'alpha_dash'           => ':Attribute hanya boleh berisi huruf, angka, strip, dan garis bawah.',
    'alpha_num'            => ':Attribute hanya boleh berisi huruf dan angka.',
    'array'                => ':Attribute harus berisi sebuah array.',
    'ascii'                => ':Attribute hanya boleh berisi karakter dan simbol alfanumerik single-byte.',
    'attached'             => ':Attribute sudah dilampirkan.',
    'before'               => ':Attribute harus berisi tanggal sebelum :date.',
    'before_or_equal'      => ':Attribute harus berisi tanggal sebelum atau sama dengan :date.',
    'between'              => [
        'array'   => ':Attribute harus memiliki :min sampai :max anggota.',
        'file'    => ':Attribute harus berukuran antara :min sampai :max kilobita.',
        'numeric' => ':Attribute harus bernilai antara :min sampai :max.',
        'string'  => ':Attribute harus berisi antara :min sampai :max karakter.',
    ],
    'boolean'              => ':Attribute harus bernilai true atau false.',
    'confirmed'            => 'Konfirmasi :attribute tidak cocok.',
    'current_password'     => 'Kata sandi salah.',
    'date'                 => ':Attribute bukan tanggal yang valid.',
    'date_equals'          => ':Attribute harus berisi tanggal yang sama dengan :date.',
    'date_format'          => ':Attribute tidak cocok dengan format :format.',
    'declined'             => ':Attribute ini harus ditolak.',
    'declined_if'          => ':Attribute ini harus ditolak ketika :other bernilai :value.',
    'different'            => ':Attribute dan :other harus berbeda.',
    'digits'               => ':Attribute harus terdiri dari :digits angka.',
    'digits_between'       => ':Attribute harus terdiri dari :min sampai :max angka.',
    'dimensions'           => ':Attribute tidak memiliki dimensi gambar yang valid.',
    'distinct'             => ':Attribute memiliki nilai yang duplikat.',
    'email'                => ':Attribute harus berupa alamat surel yang valid.',
    'ends_with'            => ':Attribute harus diakhiri salah satu dari berikut: :values',
    'enum'                 => ':Attribute yang dipilih tidak valid.',
    'exists'               => ':Attribute yang dipilih tidak valid.',
    'file'                 => ':Attribute harus berupa sebuah berkas.',
    'filled'               => ':Attribute harus memiliki nilai.',
    'gt'                   => [
        'array'   => ':Attribute harus memiliki lebih dari :value anggota.',
        'file'    => ':Attribute harus berukuran lebih besar dari :value kilobita.',
        'numeric' => ':Attribute harus bernilai lebih besar dari :value.',
        'string'  => ':Attribute harus berisi lebih besar dari :value karakter.',
    ],
    'gte'                  => [
        'array'   => ':Attribute harus terdiri dari :value anggota atau lebih.',
        'file'    => ':Attribute harus berukuran lebih besar dari atau sama dengan :value kilobita.',
        'numeric' => ':Attribute harus bernilai lebih besar dari atau sama dengan :value.',
        'string'  => ':Attribute harus berisi lebih besar dari atau sama dengan :value karakter.',
    ],
    'image'                => ':Attribute harus berupa gambar.',
    'in'                   => ':Attribute yang dipilih tidak valid.',
    'in_array'             => ':Attribute tidak ada di dalam :other.',
    'integer'              => ':Attribute harus berupa bilangan bulat.',
    'ip'                   => ':Attribute harus berupa alamat IP yang valid.',
    'ipv4'                 => ':Attribute harus berupa alamat IPv4 yang valid.',
    'ipv6'                 => ':Attribute harus berupa alamat IPv6 yang valid.',
    'json'                 => ':Attribute harus berupa JSON string yang valid.',
    'lt'                   => [
        'array'   => ':Attribute harus memiliki kurang dari :value anggota.',
        'file'    => ':Attribute harus berukuran kurang dari :value kilobita.',
        'numeric' => ':Attribute harus bernilai kurang dari :value.',
        'string'  => ':Attribute harus berisi kurang dari :value karakter.',
    ],
    'lte'                  => [
        'array'   => ':Attribute harus tidak lebih dari :value anggota.',
        'file'    => ':Attribute harus berukuran kurang dari atau sama dengan :value kilobita.',
        'numeric' => ':Attribute harus bernilai kurang dari atau sama dengan :value.',
        'string'  => ':Attribute harus berisi kurang dari atau sama dengan :value karakter.',
    ],
    'mac_address'          => ':Attribute harus berupa alamat MAC yang valid.',
    'max'                  => [
        'array'   => ':Attribute maksimal terdiri dari :max anggota.',
        'file'    => ':Attribute maksimal berukuran :max kilobita.',
        'numeric' => ':Attribute maksimal bernilai :max.',
        'string'  => ':Attribute maksimal berisi :max karakter.',
    ],
    'mimes'                => ':Attribute harus berupa berkas berjenis: :values.',
    'mimetypes'            => ':Attribute harus berupa berkas berjenis: :values.',
    'min'                  => [
        'array'   => ':Attribute minimal terdiri dari :min anggota.',
        'file'    => ':Attribute minimal berukuran :min kilobita.',
        'numeric' => ':Attribute minimal bernilai :min.',
        'string'  => ':Attribute minimal berisi :min karakter.',
    ],
    'multiple_of'          => ':Attribute harus merupakan kelipatan dari :value',
    'not_in'               => ':Attribute yang dipilih tidak valid.',
    'not_regex'            => 'Format :attribute tidak valid.',
    'numeric'              => ':Attribute harus berupa angka.',
    'password'             => 'Kata sandi salah.',
    'present'              => ':Attribute wajib ada.',
    'prohibited'           => ':Attribute tidak boleh ada.',
    'prohibited_if'        => ':Attribute tidak boleh ada bila :other adalah :value.',
    'prohibited_unless'    => ':Attribute tidak boleh ada kecuali :other memiliki nilai :values.',
    'prohibits'            => ':Attribute melarang isian :other untuk ditampilkan.',
    'regex'                => 'Format :attribute tidak valid.',
    'required'             => ':Attribute wajib diisi.',
    'required_if'          => ':Attribute wajib diisi bila :other adalah :value.',
    'required_unless'      => ':Attribute wajib diisi kecuali :other memiliki nilai :values.',
    'required_with'        => ':Attribute wajib diisi bila terdapat :values.',
    'required_with_all'    => ':Attribute wajib diisi bila terdapat :values.',
    'required_without'     => ':Attribute wajib diisi bila tidak terdapat :values.',
    'required_without_all' => ':Attribute wajib diisi bila sama sekali tidak terdapat :values.',
    'same'                 => ':Attribute dan :other harus sama.',
    'size'                 => [
        'array'   => ':Attribute harus mengandung :size anggota.',
        'file'    => ':Attribute harus berukuran :size kilobyte.',
        'numeric' => ':Attribute harus berukuran :size.',
        'string'  => ':Attribute harus berukuran :size karakter.',
    ],
    'starts_with'          => ':Attribute harus diawali salah satu dari berikut: :values',
    'string'               => ':Attribute harus berupa string.',
    'timezone'             => ':Attribute harus berisi zona waktu yang valid.',
    'unique'               => ':Attribute sudah ada sebelumnya.',
    'uploaded'             => ':Attribute gagal diunggah.',
    'url'                  => 'Format :attribute tidak valid.',
    'uuid'                 => ':Attribute harus merupakan UUID yang valid.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Di sini Anda dapat menentukan pesan validasi khusus untuk atribut menggunakan
    | konvensi "attribute.rule" untuk memberi nama baris. Ini membuatnya cepat
    | untuk menentukan baris bahasa khusus tertentu untuk aturan atribut tertentu.
    |
    */

    'custom' => [
        'email' => [
            'required' => 'Alamat email wajib diisi.',
            'email'    => 'Alamat email tidak valid.',
        ],
        'password' => [
            'required' => 'Kata sandi wajib diisi.',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | Baris bahasa berikut digunakan untuk menukar placeholder atribut
    | dengan sesuatu yang lebih ramah pembaca seperti "Alamat Email" daripada "email".
    |
    */

    'attributes' => [
        'email'    => 'Alamat Email',
        'password' => 'Kata Sandi',
        // tambahkan atribut lain sesuai kebutuhan
    ],
];