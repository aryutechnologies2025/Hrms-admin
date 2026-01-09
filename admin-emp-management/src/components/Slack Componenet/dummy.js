 {/* {Array.isArray(m.files) &&
                      m.files.map((f, idx) => {
                        const icon = getFileIcon(f.type, f.name);
                        const src = `http://localhost:5000${f.url}`;

                        return (
                          <div key={idx} className="mt-3">
                            {f.type.startsWith("image") && (
                              <div className="relative group">
                                <img
                                  src={src}
                                  className="rounded-xl max-w-full h-auto shadow-sm"
                                  alt="Attachment"
                                />
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <a
                                    href={src}
                                    download
                                    className="p-2 bg-black/60 rounded-full text-white hover:bg-black/80"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            )}

                            {f.type.startsWith("video") && (
                              <div className="relative rounded-xl overflow-hidden">
                                <video controls className="w-full">
                                  <source src={src} type={f.type} />
                                </video>
                              </div>
                            )}

                            {f.type.startsWith("audio") && (
                              <div className="p-3 bg-black/5 rounded-lg">
                                <audio controls className="w-full" src={src} />
                              </div>
                            )}

                            {!f.type.startsWith("image") &&
                              !f.type.startsWith("video") &&
                              !f.type.startsWith("audio") && (
                                <a
                                  href={src}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-3 p-3 rounded-xl ${
                                    isMe
                                      ? "bg-blue-500/20 hover:bg-blue-500/30"
                                      : "bg-gray-100 hover:bg-gray-200"
                                  } transition-colors group`}
                                >
                                  <div
                                    className={`p-2 rounded-lg ${
                                      isMe ? "bg-white/20" : "bg-gray-200"
                                    }`}
                                  >
                                    <span className="text-xl">{icon}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {f.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatSize(f.size)}
                                    </p>
                                  </div>
                                  <Download className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </a>
                              )}
                          </div>
                        );
                      })} */}

                    {/* {Array.isArray(m.files) &&
  m.files.map((f) => {
    const src = `http://localhost:5000${f.url}`;

    return (
      <div key={f._id} className="mt-3 relative group">

        if(f.isDeleteFile) {

        };
        
        {f.type.startsWith("image") && (
          <div className="relative">
            <img
              src={src}
              className="rounded-xl max-w-full h-auto shadow-sm"
              alt={f.name}
            />

            <FileActions
              src={src}
              isMe={isMe}
              onDelete={() =>
                handleDeleteFile(m._id, f._id)
              }
            />
          </div>
        )}

      
        {f.type.startsWith("video") && (
          <div className="relative rounded-xl overflow-hidden">
            <video controls className="w-full">
              <source src={src} type={f.type} />
            </video>

            <FileActions
              src={src}
              isMe={isMe}
              onDelete={() =>
                handleDeleteFile(m._id, f._id)
              }
            />
          </div>
        )}

       
        {f.type.startsWith("audio") && (
          <div className="relative p-3 bg-black/5 rounded-lg">
            <audio controls className="w-full" src={src} />

            <FileActions
              src={src}
              isMe={isMe}
              onDelete={() =>
                handleDeleteFile(m._id, f._id)
              }
            />
          </div>
        )}

       
        {!f.type.startsWith("image") &&
          !f.type.startsWith("video") &&
          !f.type.startsWith("audio") && (
            <div
              className={`relative flex items-center gap-3 p-3 rounded-xl ${
                isMe
                  ? "bg-blue-500/20 hover:bg-blue-500/30"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <span className="text-xl">
                {getFileIcon(f.type, f.name)}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {f.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatSize(f.size)}
                </p>
              </div>

              <FileActions
                src={src}
                isMe={isMe}
                onDelete={() =>
                  handleDeleteFile(m._id, f._id)
                }
              />
            </div>
          )}
      </div>
    );
  })} */}