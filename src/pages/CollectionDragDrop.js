import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import { store } from "../store";
import {
  ONREORDER_CLEAR,
  GET_COLLECTION,
  REORDER_COLLECTION,
  CATALOG_SELECTED_TAB,
} from "../constants/actionTypes";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import {
  Row,
  Col,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
} from "reactstrap";
import Select from "react-dropdown-select";
import DragDropItem from "../components/DragDropItem";
import DropTargetItem from "../components/DropTargetItem";

const mapStateToProps = (state) => ({
  ...state.collectionreorder,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetCollection: (data) =>
    dispatch({
      type: GET_COLLECTION,
      payload: AxiosRequest.Collection.getCollectionCurrentList(data),
    }),
  updateCollection: (data) =>
    dispatch({
      type: REORDER_COLLECTION,
      payload: AxiosRequest.Collection.updateOrderCollection(data),
    }),
  onClear: () =>
    dispatch({
      type: ONREORDER_CLEAR,
    }),
});

class CollectionDragDrop extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      selectCollection: false,
      confirmModal: false,
      isSubmitenable: false,
    };
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
    const { path } = this.props.match;
    this.setState({ CaDragItemArray: [], ColDragItemArray: [] });
    this.onDropItem = this.onDropItem.bind(this);
    this.onChangeArrayMake = this.onChangeArrayMake.bind(this);
    this.onUpdateCollection = this.onUpdateCollection.bind(this);
    this.onConfirmToupdate = this.onConfirmToupdate.bind(this);
    this.props.onGetCollection();
    store.dispatch({ type: CATALOG_SELECTED_TAB, tab_type: 5 });
  }
  UNSAFE_componentWillUpdate() {
    console.log("--componentWillUpdate-->");
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("--componentWillReceiveProps-->next", nextProps.match);
    console.log("--componentWillReceiveProps-->", this.props.match);
  }
  componentWillUnmount() {
    console.log("--componentWillUnmount-->");
  }

  componentDidMount() {
    console.log("--componentDidMount-->");
  }
  componentDidUpdate(nextProps, nextState) {
    console.log("--componentDidUpdate-->");
    if (this.props.isUpdate) {
      this.props.onClear();
      window.location.reload(false);
    }
  }
  componentDidCatch() {
    console.log("--componentDidCatch-->");
  }

  onDropItem(dropItem) {
    var catItem = this.state.CaDragItemArray;
    var collItem = this.state.ColDragItemArray;
    if (dropItem.tile_type === 1) {
      catItem = catItem.filter((item) => item.index !== dropItem.index);
      this.setState({ CaDragItemArray: catItem });
      console.log(catItem);
    } else {
      collItem = collItem.filter((item) => item.index !== dropItem.index);
      this.setState({ ColDragItemArray: collItem });
      console.log(collItem);
    }
    var isbool=(this.props.collectionlist.length - 1) ===(catItem.length + collItem.length);
    this.setState({
      isSubmitenable:isbool,
    });
  }

  onChangeArrayMake(Item) {
    if (Item.tile_type === 1) {
      var caDragItem = this.state.CaDragItemArray || [];
      caDragItem.push(Item);
      this.setState({ CaDragItemArray: caDragItem });
    } else {
      var colDragItem = this.state.ColDragItemArray || [];
      colDragItem.push(Item);
      this.setState({ ColDragItemArray: colDragItem });
    }
    this.setState({
      isSubmitenable:
        this.props.collectionlist.length - 1 ===
        this.state.ColDragItemArray.length + this.state.CaDragItemArray.length,
    });
    //const sorted = DragItem.sort((a, b) => b.index-a.index);
  }
  toggleConform = () => {
    this.setState((prevState) => ({
      confirmModal: !prevState.confirmModal,
    }));
  };
  onConfirmToupdate() {
    var caDragItem = this.state.CaDragItemArray || [];
    var colDragItem = this.state.ColDragItemArray || [];
    // const caSorted = caDragItem.sort((a, b) => b.index-a.index);
    //const coSorted = colDragItem.sort((a, b) => b.index-a.index);
    caDragItem.sort(function (a, b) {
      return a.index - b.index;
    });

    colDragItem.sort(function (a, b) {
      return a.index - b.index;
    });
    var categorylist = [];
    var collectionlist = [];
    for (var i = 0; i < caDragItem.length; i++) {
      var caI = {
        catid: caDragItem[i].catid,
        layout_position: i + 1,
        type: caDragItem[i].type,
      };
      categorylist.push(caI);
    }

    for (var i = 0; i < colDragItem.length; i++) {
      var coI = {
        cid: colDragItem[i].cid,
        layout_position: i + 1,
        type: colDragItem[i].type,
      };
      collectionlist.push(coI);
    }
    var sendItem = {
      categorylist: categorylist,
      collectionlist: collectionlist,
    };
    this.toggleConform();
    this.props.updateCollection(sendItem);
  }

  onUpdateCollection() {
    if (
      this.state.CaDragItemArray.length == 0 &&
      this.state.ColDragItemArray.length == 0
    ) {
      notify.show(
        "Please Drag and drop list after try this",
        "custom",
        1000,
        notification_color
      );
    } else {
      this.toggleConform();
    }
  }

  render() {
    const collectionlist = this.props.collectionlist || [];
    const collectiondraglist = this.props.collectiondraglist || [];
    const collectionFirstItem =
      this.props.collectionlist.length != 0
        ? this.props.collectionlist[0].image
        : "";
    return (
      <div className="width-full">
        <div className="scroll-collecton-reorder mr-t-10">
          <div
            style={{
              float: "left",
              width: 350,
              height: 500,
              marginTop: 40,
              marginLeft: 40,
              overflow: "auto",
              border: "1px solid black",
            }}
          >
            {collectionlist.map((item, i) => (
              <DragDropItem
                targetKey={item.tile_type}
                item={item}
                dragable={i === 0 ? true : false}
              />
            ))}
          </div>
          <div
            style={{
              float: "left",
              width: 350,
              height: 500,
              marginTop: 40,
              marginLeft: 40,
              overflow: "auto",
              border: "1px solid black",
              flexFlow: "row wrap",
              display: "flex",
            }}
          >
            {collectionFirstItem &&
              collectionlist.map((item, i) => (
                <DropTargetItem
                  targetKey={item.tile_type}
                  citem={item}
                  index={i}
                  onDropItem={this.onDropItem}
                  dragArray={this.onChangeArrayMake}
                  defult_item={i === 0 ? item : ""}
                  undo_hidden={i === 0 ? true : false}
                  image={i === 0 ? collectionFirstItem : ""}
                ></DropTargetItem>
              ))}
          </div>
          <div>
            <Button
              size="sm"
              onClick={() => window.location.reload(false)}
              disabled={
                this.state.CaDragItemArray.length == 0 &&
                this.state.ColDragItemArray.length == 0
              }
            >
              Reset
            </Button>
            <Button
              size="sm"
              disabled={!this.state.isSubmitenable}
              onClick={this.onUpdateCollection}
              className="mr-l-10"
            >
              Submit
            </Button>
          </div>
        </div>
        <Modal
          isOpen={this.state.confirmModal}
          toggle={this.toggleConform}
          className="add_live_modal"
          backdrop={"static"}
        >
          <ModalHeader>Confirmation </ModalHeader>
          <ModalBody>
            Are you sure you want to update the app tiles layout?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onConfirmToupdate}>
              Yes
            </Button>
            <Button color="secondary" onClick={this.toggleConform}>
              NO
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CollectionDragDrop);
